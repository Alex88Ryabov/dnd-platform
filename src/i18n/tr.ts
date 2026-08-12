import type { AppLang } from '../model/types';
import { getLang, useLang } from './lang';

// одна строка интерфейса во всех трёх языках; {имя} — подстановка параметра
export type Tri = Record<AppLang, string>;

export function trFor(lang: AppLang, entry: Tri, params?: Record<string, string | number>): string {
  let text = entry[lang];
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      text = text.replaceAll(`{${key}}`, String(value));
    }
  }
  return text;
}

// перевод вне React — язык берётся из настроек на момент вызова
export function tr(entry: Tri, params?: Record<string, string | number>): string {
  return trFor(getLang(), entry, params);
}

export function useT() {
  const lang = useLang();
  return (entry: Tri, params?: Record<string, string | number>) => trFor(lang, entry, params);
}
