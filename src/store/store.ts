import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Character, CombatState, Combatant, ConditionId, JournalEntry, Money, NpcNote,
  PlaceNote, PlayerReview, Quest, RollLogEntry, SaveSlot, Settings,
} from '../model/types';
import { uid } from '../engine/dice';

export type ViewId = 'home' | 'characters' | 'dice' | 'master' | 'journal' | 'library';

const EMPTY_COMBAT: CombatState = {
  active: false,
  round: 1,
  turnIndex: 0,
  combatants: [],
};

export interface AppState {
  characters: Character[];
  journal: JournalEntry[];
  quests: Quest[];
  npcs: NpcNote[];
  places: PlaceNote[];
  combat: CombatState;
  rollLog: RollLogEntry[];
  settings: Settings;
  snapshots: SaveSlot[];
  view: ViewId;
  selectedCharacterId?: string;

  saveSnapshot: (name: string) => void;
  restoreSnapshot: (id: string) => boolean;
  deleteSnapshot: (id: string) => void;

  setView: (view: ViewId) => void;
  selectCharacter: (id?: string) => void;

  addCharacter: (char: Character) => void;
  updateCharacter: (id: string, updater: (char: Character) => Character) => void;
  patchCharacter: (id: string, patch: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;

  pushRoll: (entry: Omit<RollLogEntry, 'id' | 'ts'>) => void;
  clearRollLog: () => void;

  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'ts'>) => void;
  updateJournalEntry: (id: string, patch: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  addQuest: (quest: Omit<Quest, 'id'>) => void;
  updateQuest: (id: string, patch: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;

  addNpc: (npc: Omit<NpcNote, 'id'>) => void;
  updateNpc: (id: string, patch: Partial<NpcNote>) => void;
  deleteNpc: (id: string) => void;

  addPlace: (place: Omit<PlaceNote, 'id'>) => void;
  updatePlace: (id: string, patch: Partial<PlaceNote>) => void;
  deletePlace: (id: string) => void;

  reviews: PlayerReview[];
  addReview: (review: Omit<PlayerReview, 'id' | 'ts'>) => void;
  deleteReview: (id: string) => void;

  startCombat: () => void;
  endCombat: () => void;
  addCombatant: (combatant: Omit<Combatant, 'uid'>) => void;
  removeCombatant: (uid: string) => void;
  updateCombatant: (uid: string, patch: Partial<Combatant>) => void;
  damageCombatant: (uid: string, amount: number) => void;
  healCombatant: (uid: string, amount: number) => void;
  toggleCombatantCondition: (uid: string, condition: ConditionId) => void;
  sortByInitiative: () => void;
  nextTurn: () => void;

  awardXp: (charIds: string[], amount: number) => void;
  awardMoney: (charId: string, money: Money) => void;

  updateSettings: (patch: Partial<Settings>) => void;
  importState: (raw: string) => boolean;
  resetAll: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      characters: [],
      journal: [],
      quests: [],
      npcs: [],
      places: [],
      combat: EMPTY_COMBAT,
      rollLog: [],
      settings: {
        campaignName: 'Летопись героев',
        soundOn: true,
        xpMode: 'xp',
        lang: 'ru',
      },
      snapshots: [],
      view: 'home',
      selectedCharacterId: undefined,

      saveSnapshot: (name) => set((s) => {
        const payload = JSON.stringify({
          characters: s.characters,
          journal: s.journal,
          quests: s.quests,
          npcs: s.npcs,
          places: s.places,
          reviews: s.reviews,
          combat: s.combat,
          rollLog: s.rollLog,
          settings: s.settings,
        });
        const slot: SaveSlot = {
          id: uid(),
          // вызывающая сторона передаёт локализованное имя; здесь только страховка
          name: name.trim() || new Date().toLocaleString(),
          ts: new Date().toISOString(),
          charactersCount: s.characters.length,
          payload,
        };
        return { snapshots: [slot, ...s.snapshots].slice(0, 8) };
      }),
      restoreSnapshot: (id) => {
        const slot = get().snapshots.find((x) => x.id === id);
        if (!slot) {
          return false;
        }
        try {
          const data = JSON.parse(slot.payload);
          set({
            characters: data.characters ?? [],
            journal: data.journal ?? [],
            quests: data.quests ?? [],
            npcs: data.npcs ?? [],
            places: data.places ?? [],
            reviews: data.reviews ?? [],
            combat: data.combat ?? EMPTY_COMBAT,
            rollLog: data.rollLog ?? [],
            settings: { ...get().settings, ...(data.settings ?? {}) },
            selectedCharacterId: undefined,
          });
          return true;
        } catch {
          return false;
        }
      },
      deleteSnapshot: (id) => set((s) => ({
        snapshots: s.snapshots.filter((x) => x.id !== id),
      })),

      setView: (view) => set({ view }),
      selectCharacter: (id) => set({ selectedCharacterId: id }),

      addCharacter: (char) => set((s) => ({
        characters: [...s.characters, char],
        selectedCharacterId: char.id,
      })),
      updateCharacter: (id, updater) => set((s) => ({
        characters: s.characters.map((c) => (c.id === id ? updater(c) : c)),
      })),
      patchCharacter: (id, patch) => set((s) => ({
        characters: s.characters.map((c) => (
          c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
        )),
      })),
      deleteCharacter: (id) => set((s) => ({
        characters: s.characters.filter((c) => c.id !== id),
        combat: {
          ...s.combat,
          combatants: s.combat.combatants.filter((cb) => cb.refId !== id),
        },
        selectedCharacterId: s.selectedCharacterId === id ? undefined : s.selectedCharacterId,
      })),

      pushRoll: (entry) => set((s) => ({
        rollLog: [
          { ...entry, id: uid(), ts: new Date().toISOString() },
          ...s.rollLog,
        ].slice(0, 100),
      })),
      clearRollLog: () => set({ rollLog: [] }),

      addJournalEntry: (entry) => set((s) => ({
        journal: [{ ...entry, id: uid(), ts: new Date().toISOString() }, ...s.journal],
      })),
      updateJournalEntry: (id, patch) => set((s) => ({
        journal: s.journal.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),
      deleteJournalEntry: (id) => set((s) => ({
        journal: s.journal.filter((e) => e.id !== id),
      })),

      addQuest: (quest) => set((s) => ({ quests: [{ ...quest, id: uid() }, ...s.quests] })),
      updateQuest: (id, patch) => set((s) => ({
        quests: s.quests.map((q) => (q.id === id ? { ...q, ...patch } : q)),
      })),
      deleteQuest: (id) => set((s) => ({ quests: s.quests.filter((q) => q.id !== id) })),

      addNpc: (npc) => set((s) => ({ npcs: [{ ...npc, id: uid() }, ...s.npcs] })),
      updateNpc: (id, patch) => set((s) => ({
        npcs: s.npcs.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      })),
      deleteNpc: (id) => set((s) => ({ npcs: s.npcs.filter((n) => n.id !== id) })),

      reviews: [],
      addReview: (review) => set((s) => ({
        reviews: [{ ...review, id: uid(), ts: new Date().toISOString() }, ...s.reviews],
      })),
      deleteReview: (id) => set((s) => ({
        reviews: s.reviews.filter((r) => r.id !== id),
      })),

      addPlace: (place) => set((s) => ({ places: [{ ...place, id: uid() }, ...s.places] })),
      updatePlace: (id, patch) => set((s) => ({
        places: s.places.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })),
      deletePlace: (id) => set((s) => ({ places: s.places.filter((p) => p.id !== id) })),

      startCombat: () => set((s) => ({
        combat: { ...s.combat, active: true, round: 1, turnIndex: 0 },
      })),
      endCombat: () => set({ combat: EMPTY_COMBAT }),
      addCombatant: (combatant) => set((s) => ({
        combat: {
          ...s.combat,
          combatants: [...s.combat.combatants, { ...combatant, uid: uid() }],
        },
      })),
      removeCombatant: (cuid) => set((s) => {
        const idx = s.combat.combatants.findIndex((c) => c.uid === cuid);
        const combatants = s.combat.combatants.filter((c) => c.uid !== cuid);
        let turnIndex = s.combat.turnIndex;
        if (idx !== -1 && idx < turnIndex) {
          turnIndex -= 1;
        }
        if (turnIndex >= combatants.length) {
          turnIndex = 0;
        }
        return { combat: { ...s.combat, combatants, turnIndex } };
      }),
      updateCombatant: (cuid, patch) => set((s) => ({
        combat: {
          ...s.combat,
          combatants: s.combat.combatants.map((c) => (c.uid === cuid ? { ...c, ...patch } : c)),
        },
      })),
      damageCombatant: (cuid, amount) => {
        const s = get();
        const combatant = s.combat.combatants.find((c) => c.uid === cuid);
        if (!combatant || amount <= 0) {
          return;
        }
        if (combatant.kind === 'pc' && combatant.refId) {
          const char = s.characters.find((c) => c.id === combatant.refId);
          if (char) {
            // сначала урон снимает временные хиты — как по правилам
            const fromTemp = Math.min(char.hpTemp, amount);
            const rest = amount - fromTemp;
            s.patchCharacter(char.id, {
              hpTemp: char.hpTemp - fromTemp,
              hpCurrent: Math.max(0, char.hpCurrent - rest),
            });
          }
          return;
        }
        const newHp = Math.max(0, combatant.hp - amount);
        s.updateCombatant(cuid, { hp: newHp, defeated: newHp === 0 });
      },
      healCombatant: (cuid, amount) => {
        const s = get();
        const combatant = s.combat.combatants.find((c) => c.uid === cuid);
        if (!combatant || amount <= 0) {
          return;
        }
        if (combatant.kind === 'pc' && combatant.refId) {
          const char = s.characters.find((c) => c.id === combatant.refId);
          if (char) {
            s.updateCharacter(char.id, (c) => ({
              ...c,
              hpCurrent: c.hpCurrent + amount,
              deathSaves: { successes: 0, failures: 0 },
            }));
          }
          return;
        }
        s.updateCombatant(cuid, {
          hp: Math.min(combatant.hpMax, combatant.hp + amount),
          defeated: false,
        });
      },
      toggleCombatantCondition: (cuid, condition) => set((s) => ({
        combat: {
          ...s.combat,
          combatants: s.combat.combatants.map((c) => {
            if (c.uid !== cuid) {
              return c;
            }
            const has = c.conditions.includes(condition);
            return {
              ...c,
              conditions: has
                ? c.conditions.filter((x) => x !== condition)
                : [...c.conditions, condition],
            };
          }),
        },
      })),
      sortByInitiative: () => set((s) => ({
        combat: {
          ...s.combat,
          combatants: [...s.combat.combatants].sort((a, b) => b.initiative - a.initiative),
          turnIndex: 0,
        },
      })),
      nextTurn: () => set((s) => {
        const count = s.combat.combatants.length;
        if (count === 0) {
          return {};
        }
        const nextIndex = (s.combat.turnIndex + 1) % count;
        return {
          combat: {
            ...s.combat,
            turnIndex: nextIndex,
            round: nextIndex === 0 ? s.combat.round + 1 : s.combat.round,
          },
        };
      }),

      awardXp: (charIds, amount) => set((s) => ({
        characters: s.characters.map((c) => (
          charIds.includes(c.id)
            ? { ...c, xp: c.xp + amount, updatedAt: new Date().toISOString() }
            : c
        )),
      })),
      awardMoney: (charId, money) => set((s) => ({
        characters: s.characters.map((c) => (
          c.id === charId
            ? {
              ...c,
              money: {
                pp: c.money.pp + money.pp,
                gp: c.money.gp + money.gp,
                ep: c.money.ep + money.ep,
                sp: c.money.sp + money.sp,
                cp: c.money.cp + money.cp,
              },
              updatedAt: new Date().toISOString(),
            }
            : c
        )),
      })),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      importState: (raw) => {
        try {
          const data = JSON.parse(raw);
          if (!data || typeof data !== 'object' || !Array.isArray(data.characters)) {
            return false;
          }
          set({
            characters: data.characters ?? [],
            journal: data.journal ?? [],
            quests: data.quests ?? [],
            npcs: data.npcs ?? [],
            places: data.places ?? [],
            reviews: data.reviews ?? [],
            settings: { ...get().settings, ...(data.settings ?? {}) },
            combat: data.combat ?? EMPTY_COMBAT,
            rollLog: data.rollLog ?? [],
          });
          return true;
        } catch {
          return false;
        }
      },
      resetAll: () => set({
        characters: [],
        journal: [],
        quests: [],
        npcs: [],
        places: [],
        reviews: [],
        combat: EMPTY_COMBAT,
        rollLog: [],
        selectedCharacterId: undefined,
      }),
    }),
    {
      name: 'dnd-platform-v1',
      version: 2,
      // v2: появился выбор языка — старым сохранениям проставляем русский
      migrate: (persisted) => {
        const state = persisted as AppState;
        if (state.settings && !state.settings.lang) {
          state.settings.lang = 'ru';
        }
        return state;
      },
    },
  ),
);

export function exportStateJson(): string {
  const s = useStore.getState();
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      characters: s.characters,
      journal: s.journal,
      quests: s.quests,
      npcs: s.npcs,
      places: s.places,
      reviews: s.reviews,
      settings: s.settings,
      combat: s.combat,
      rollLog: s.rollLog,
    },
    null,
    2,
  );
}
