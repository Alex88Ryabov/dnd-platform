import type { AppLang } from '../model/types';
import { getLang } from './lang';

// расстояние из футов в строку по языку: ru/uk — метры (3 м = 10 фт), en — футы
export function fmtDistance(feet: number, lang: AppLang = getLang()): string {
  if (lang === 'en') {
    return `${feet} ft`;
  }
  const meters = feet * 0.3;
  const text = Number.isInteger(meters) ? String(meters) : meters.toFixed(1).replace('.', ',');
  return `${text} м`;
}
