import { useStore } from './store/store';
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

export function App() {
  const view = useStore((s) => s.view);

  return (
    <>
      <Embers />
      <div className="app-shell">
        <Sidebar />
        <main className="main-area">
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
