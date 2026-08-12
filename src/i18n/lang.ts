import type { AppLang } from '../model/types';
import { useStore } from '../store/store';

export const LANGS: AppLang[] = ['ru', 'uk', 'en'];

export const LANG_LABELS: Record<AppLang, string> = {
  ru: 'Рус',
  uk: 'Укр',
  en: 'Eng',
};

// локаль для форматирования дат
export const LANG_LOCALES: Record<AppLang, string> = {
  ru: 'ru',
  uk: 'uk',
  en: 'en-GB',
};

// текущий язык вне React (движок, журнал, тосты)
export function getLang(): AppLang {
  return useStore.getState().settings.lang;
}

export function useLang(): AppLang {
  return useStore((s) => s.settings.lang);
}
