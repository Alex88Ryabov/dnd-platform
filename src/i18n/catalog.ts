import { catalog } from './data/merge';
import { getLang, useLang } from './lang';

// локализованные каталоги правил; вне React язык берётся из настроек
export function getCatalog(lang = getLang()) {
  return catalog(lang);
}

export function useCatalog() {
  return catalog(useLang());
}
