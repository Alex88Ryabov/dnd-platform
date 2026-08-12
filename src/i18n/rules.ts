import type {
  Ability, AppLang, ConditionId, DamageType, Rarity, Recharge, Size, SkillId, SpellSchool, WeaponMastery,
} from '../model/types';
import {
  ABILITY_NAMES, ABILITY_SHORT, ALIGNMENTS, CONDITIONS, DAMAGE_TYPE_NAMES, MASTERY_INFO,
  RARITY_INFO, RECHARGE_NAMES, SCHOOL_NAMES, SIZE_NAMES, SKILLS,
} from '../data/core';
import {
  ABILITY_NAMES_UK, ABILITY_SHORT_UK, ALIGNMENTS_UK, CONDITIONS_UK, DAMAGE_TYPE_NAMES_UK,
  MASTERY_INFO_UK, RARITY_NAMES_UK, RECHARGE_NAMES_UK, SCHOOL_NAMES_UK, SIZE_NAMES_UK, SKILL_NAMES_UK,
} from './core.uk';
import {
  ABILITY_NAMES_EN, ABILITY_SHORT_EN, ALIGNMENTS_EN, CONDITIONS_EN, DAMAGE_TYPE_NAMES_EN,
  MASTERY_INFO_EN, RARITY_NAMES_EN, RECHARGE_NAMES_EN, SCHOOL_NAMES_EN, SIZE_NAMES_EN, SKILL_NAMES_EN,
} from './core.en';
import { getLang, useLang } from './lang';

export interface RulesL10n {
  abilityNames: Record<Ability, string>;
  abilityShort: Record<Ability, string>;
  skillNames: Record<SkillId, string>;
  conditions: Record<ConditionId, { name: string; icon: string; description: string }>;
  damageTypes: Record<DamageType, string>;
  schoolNames: Record<SpellSchool, string>;
  masteryInfo: Record<WeaponMastery, { name: string; description: string }>;
  sizeNames: Record<Size, string>;
  rarityInfo: Record<Rarity, { name: string; color: string }>;
  rechargeNames: Record<Recharge, string>;
  alignments: string[];
}

const CONDITION_IDS = Object.keys(CONDITIONS) as ConditionId[];
const RARITY_IDS = Object.keys(RARITY_INFO) as Rarity[];

function buildRules(lang: AppLang): RulesL10n {
  if (lang === 'ru') {
    return {
      abilityNames: ABILITY_NAMES,
      abilityShort: ABILITY_SHORT,
      skillNames: Object.fromEntries(SKILLS.map((s) => [s.id, s.name])) as Record<SkillId, string>,
      conditions: CONDITIONS,
      damageTypes: DAMAGE_TYPE_NAMES,
      schoolNames: SCHOOL_NAMES,
      masteryInfo: MASTERY_INFO,
      sizeNames: SIZE_NAMES,
      rarityInfo: RARITY_INFO,
      rechargeNames: RECHARGE_NAMES,
      alignments: ALIGNMENTS,
    };
  }
  const uk = lang === 'uk';
  const conditionTexts = uk ? CONDITIONS_UK : CONDITIONS_EN;
  const rarityNames = uk ? RARITY_NAMES_UK : RARITY_NAMES_EN;
  return {
    abilityNames: uk ? ABILITY_NAMES_UK : ABILITY_NAMES_EN,
    abilityShort: uk ? ABILITY_SHORT_UK : ABILITY_SHORT_EN,
    skillNames: uk ? SKILL_NAMES_UK : SKILL_NAMES_EN,
    // иконки состояний и цвета редкости общие — берём из русского каталога
    conditions: Object.fromEntries(CONDITION_IDS.map((id) => [
      id, { ...conditionTexts[id], icon: CONDITIONS[id].icon },
    ])) as RulesL10n['conditions'],
    damageTypes: uk ? DAMAGE_TYPE_NAMES_UK : DAMAGE_TYPE_NAMES_EN,
    schoolNames: uk ? SCHOOL_NAMES_UK : SCHOOL_NAMES_EN,
    masteryInfo: uk ? MASTERY_INFO_UK : MASTERY_INFO_EN,
    sizeNames: uk ? SIZE_NAMES_UK : SIZE_NAMES_EN,
    rarityInfo: Object.fromEntries(RARITY_IDS.map((id) => [
      id, { name: rarityNames[id], color: RARITY_INFO[id].color },
    ])) as RulesL10n['rarityInfo'],
    rechargeNames: uk ? RECHARGE_NAMES_UK : RECHARGE_NAMES_EN,
    alignments: uk ? ALIGNMENTS_UK : ALIGNMENTS_EN,
  };
}

const rulesCache = new Map<AppLang, RulesL10n>();

export function rules(lang: AppLang = getLang()): RulesL10n {
  let bundle = rulesCache.get(lang);
  if (!bundle) {
    bundle = buildRules(lang);
    rulesCache.set(lang, bundle);
  }
  return bundle;
}

export function useRules(): RulesL10n {
  return rules(useLang());
}

// мировоззрение хранится русской строкой — для показа переводим по позиции в списке
export function alignmentLabel(value: string, lang: AppLang): string {
  const idx = ALIGNMENTS.indexOf(value);
  if (idx === -1) {
    return value;
  }
  return rules(lang).alignments[idx];
}
