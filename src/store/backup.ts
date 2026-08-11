import { exportStateJson, useStore } from './store';
import { toast } from '../components/Toasts';

// скачивает все данные платформы в json-файл
export function downloadBackup() {
  const blob = new Blob([exportStateJson()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `letopis-geroev-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Копия сохранена', 'Файл с героями и журналом скачан', '📜');
}

// восстанавливает данные из выбранного файла резервной копии
export function importBackupFile(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    const ok = useStore.getState().importState(String(reader.result ?? ''));
    if (ok) {
      toast('Данные загружены', 'Герои и журнал восстановлены из файла', '✨');
    } else {
      toast('Не получилось', 'Файл не похож на резервную копию платформы', '⚠️');
    }
  };
  reader.readAsText(file);
}
