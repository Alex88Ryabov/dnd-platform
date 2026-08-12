import { useEffect } from 'react';
import { useStore } from './store/store';
import { useLang } from './i18n/lang';
import { Embers } from './components/Embers';
import { Sidebar } from './components/Sidebar';
import { Toasts } from './components/Toasts';
import { RollOverlay } from './components/RollOverlay';
import { HomeView } from './features/home/HomeView';
import { CharactersView } from './features/characters/CharactersView';
import { DiceView } from './features/dice/DiceView';
import { MasterView } from './features/master/MasterView';
import { JournalView } from './features/journal/JournalView';
import { LibraryView } from './features/library/LibraryView';

const TITLES = {
  ru: 'Летопись Героев — D&D платформа',
  uk: 'Літопис Героїв — D&D платформа',
  en: 'Chronicle of Heroes — D&D Platform',
};

export function App() {
  const view = useStore((s) => s.view);
  const lang = useLang();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
  }, [lang]);

  return (
    <>
      <Embers />
      <div className="app-shell">
        <Sidebar />
        {/* key: смена языка перерисовывает разделы целиком — нигде не остаётся старых строк */}
        <main className="main-area" key={lang}>
          {view === 'home' && <HomeView />}
          {view === 'characters' && <CharactersView />}
          {view === 'dice' && <DiceView />}
          {view === 'master' && <MasterView />}
          {view === 'journal' && <JournalView />}
          {view === 'library' && <LibraryView />}
        </main>
      </div>
      <Toasts />
      <RollOverlay />
    </>
  );
}
