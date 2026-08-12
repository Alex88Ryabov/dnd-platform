import { useLang } from '../../i18n/lang';
import { GuideRu } from './GuideRu';
import { GuideUk } from './GuideUk';
import { GuideEn } from './GuideEn';

// «Как играть»: длинный текст с разметкой удобнее держать тремя версиями, а не словарём
export function GuideTab() {
  const lang = useLang();
  if (lang === 'uk') {
    return <GuideUk />;
  }
  if (lang === 'en') {
    return <GuideEn />;
  }
  return <GuideRu />;
}
