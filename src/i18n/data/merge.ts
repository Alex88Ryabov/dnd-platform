import type {
  AppLang, BackgroundDef, ClassDef, ClassId, FeatDef, ItemDef, MonsterDef, SpeciesDef, SpeciesId, SpellDef,
} from '../../model/types';
import { CLASSES } from '../../data/classes';
import { SPECIES } from '../../data/species';
import { BACKGROUNDS } from '../../data/backgrounds';
import { FEATS } from '../../data/feats';
import { SPELLS } from '../../data/spells';
import { ITEMS } from '../../data/equipment';
import { MONSTERS } from '../../data/monsters';
import type { NamedTextL10n } from './types';
import { CLASSES_UK } from './classes.uk';
import { CLASSES_EN } from './classes.en';
import { SPECIES_UK } from './species.uk';
import { SPECIES_EN } from './species.en';
import { BACKGROUNDS_UK } from './backgrounds.uk';
import { BACKGROUNDS_EN } from './backgrounds.en';
import { FEATS_UK } from './feats.uk';
import { FEATS_EN } from './feats.en';
import { SPELLS_UK } from './spells.uk';
import { SPELLS_EN } from './spells.en';
import { ITEMS_UK } from './equipment.uk';
import { ITEMS_EN } from './equipment.en';
import { MONSTERS_UK } from './monsters.uk';
import { MONSTERS_EN } from './monsters.en';

// накладывает перевод пар «название + описание» на массив, сохраняя остальные поля (level и т.п.)
function overlayNamed<T extends { name: string; description: string }>(base: T[], l10n?: NamedTextL10n[]): T[] {
  if (!l10n) {
    return base;
  }
  return base.map((entry, i) => (
    l10n[i] ? { ...entry, name: l10n[i].name, description: l10n[i].description } : entry
  ));
}

function localizeClasses(lang: AppLang): ClassDef[] {
  if (lang === 'ru') {
    return CLASSES;
  }
  const dict = lang === 'uk' ? CLASSES_UK : CLASSES_EN;
  return CLASSES.map((cls) => {
    const l = dict[cls.id];
    if (!l) {
      return cls;
    }
    return {
      ...cls,
      name: l.name,
      tagline: l.tagline,
      description: l.description,
      weaponProficiencies: l.weaponProficiencies,
      armorTraining: l.armorTraining,
      toolProficiencies: l.toolProficiencies ?? cls.toolProficiencies,
      subclassLabel: l.subclassLabel,
      features: overlayNamed(cls.features, l.features),
      subclasses: cls.subclasses.map((sub) => {
        const sl = l.subclasses[sub.id];
        if (!sl) {
          return sub;
        }
        return {
          ...sub,
          name: sl.name,
          description: sl.description,
          features: overlayNamed(sub.features, sl.features),
        };
      }),
      resources: cls.resources.map((res) => ({ ...res, name: l.resources[res.key] ?? res.name })),
    };
  }).sort((a, b) => a.name.localeCompare(b.name, lang));
}

function localizeSpecies(lang: AppLang): SpeciesDef[] {
  if (lang === 'ru') {
    return SPECIES;
  }
  const dict = lang === 'uk' ? SPECIES_UK : SPECIES_EN;
  return SPECIES.map((sp) => {
    const l = dict[sp.id];
    if (!l) {
      return sp;
    }
    return {
      ...sp,
      name: l.name,
      description: l.description,
      sizeNote: l.sizeNote ?? sp.sizeNote,
      traits: overlayNamed(sp.traits, l.traits),
    };
  });
}

function localizeBackgrounds(lang: AppLang): BackgroundDef[] {
  if (lang === 'ru') {
    return BACKGROUNDS;
  }
  const dict = lang === 'uk' ? BACKGROUNDS_UK : BACKGROUNDS_EN;
  return BACKGROUNDS.map((bg) => {
    const l = dict[bg.id];
    if (!l) {
      return bg;
    }
    return { ...bg, name: l.name, description: l.description, toolProficiency: l.toolProficiency, equipmentNote: l.equipmentNote };
  });
}

function localizeFeats(lang: AppLang): FeatDef[] {
  if (lang === 'ru') {
    return FEATS;
  }
  const dict = lang === 'uk' ? FEATS_UK : FEATS_EN;
  return FEATS.map((feat) => {
    const l = dict[feat.id];
    if (!l) {
      return feat;
    }
    return { ...feat, name: l.name, description: l.description };
  });
}

function localizeSpells(lang: AppLang): SpellDef[] {
  if (lang === 'ru') {
    return SPELLS;
  }
  const dict = lang === 'uk' ? SPELLS_UK : SPELLS_EN;
  return SPELLS.map((spell) => {
    const l = dict[spell.id];
    if (!l) {
      return spell;
    }
    return {
      ...spell,
      name: l.name,
      castingTime: l.castingTime,
      range: l.range,
      components: l.components,
      duration: l.duration,
      description: l.description,
      higherLevels: l.higherLevels ?? spell.higherLevels,
    };
  });
}

function localizeItems(lang: AppLang): ItemDef[] {
  if (lang === 'ru') {
    return ITEMS;
  }
  const dict = lang === 'uk' ? ITEMS_UK : ITEMS_EN;
  return ITEMS.map((item) => {
    const l = dict[item.id];
    if (!l) {
      return item;
    }
    return {
      ...item,
      name: l.name,
      description: l.description,
      weapon: item.weapon
        ? { ...item.weapon, properties: l.properties ?? item.weapon.properties }
        : undefined,
    };
  });
}

function localizeMonsters(lang: AppLang): MonsterDef[] {
  if (lang === 'ru') {
    return MONSTERS;
  }
  const dict = lang === 'uk' ? MONSTERS_UK : MONSTERS_EN;
  return MONSTERS.map((mon) => {
    const l = dict[mon.id];
    if (!l) {
      return mon;
    }
    return {
      ...mon,
      name: l.name,
      type: l.type,
      alignment: l.alignment,
      speed: l.speed,
      saves: l.saves ?? mon.saves,
      skills: l.skills ?? mon.skills,
      resistances: l.resistances ?? mon.resistances,
      immunities: l.immunities ?? mon.immunities,
      vulnerabilities: l.vulnerabilities ?? mon.vulnerabilities,
      senses: l.senses,
      languages: l.languages,
      description: l.description,
      traits: mon.traits ? overlayNamed(mon.traits, l.traits) : undefined,
      actions: overlayNamed(mon.actions, l.actions),
      bonusActions: mon.bonusActions ? overlayNamed(mon.bonusActions, l.bonusActions) : undefined,
      reactions: mon.reactions ? overlayNamed(mon.reactions, l.reactions) : undefined,
      legendary: mon.legendary ? overlayNamed(mon.legendary, l.legendary) : undefined,
    };
  });
}

interface Catalog {
  classes: ClassDef[];
  classesById: Record<ClassId, ClassDef>;
  species: SpeciesDef[];
  speciesById: Record<SpeciesId, SpeciesDef>;
  backgrounds: BackgroundDef[];
  backgroundsById: Record<string, BackgroundDef>;
  feats: FeatDef[];
  featsById: Record<string, FeatDef>;
  originFeats: FeatDef[];
  fightingStyles: FeatDef[];
  spells: SpellDef[];
  spellsById: Record<string, SpellDef>;
  items: ItemDef[];
  itemsById: Record<string, ItemDef>;
  monsters: MonsterDef[];
}

function buildCatalog(lang: AppLang): Catalog {
  const classes = localizeClasses(lang);
  const species = localizeSpecies(lang);
  const backgrounds = localizeBackgrounds(lang);
  const feats = localizeFeats(lang);
  const spells = localizeSpells(lang);
  const items = localizeItems(lang);
  return {
    classes,
    classesById: Object.fromEntries(classes.map((c) => [c.id, c])) as Record<ClassId, ClassDef>,
    species,
    speciesById: Object.fromEntries(species.map((s) => [s.id, s])) as Record<SpeciesId, SpeciesDef>,
    backgrounds,
    backgroundsById: Object.fromEntries(backgrounds.map((b) => [b.id, b])),
    feats,
    featsById: Object.fromEntries(feats.map((f) => [f.id, f])),
    originFeats: feats.filter((f) => f.category === 'origin'),
    fightingStyles: feats.filter((f) => f.category === 'fightingStyle'),
    spells,
    spellsById: Object.fromEntries(spells.map((s) => [s.id, s])),
    items,
    itemsById: Object.fromEntries(items.map((i) => [i.id, i])),
    monsters: localizeMonsters(lang),
  };
}

const catalogCache = new Map<AppLang, Catalog>();

export function catalog(lang: AppLang): Catalog {
  let built = catalogCache.get(lang);
  if (!built) {
    built = buildCatalog(lang);
    catalogCache.set(lang, built);
  }
  return built;
}
