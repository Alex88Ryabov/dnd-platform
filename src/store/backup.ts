import { exportStateJson, useStore } from './store';
import { tr } from '../i18n/tr';
import { T_COMMON } from '../i18n/ui/common';
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
  toast(tr(T_COMMON.backupSaved), tr(T_COMMON.backupSavedText), '📜');
}

// восстанавливает данные из выбранного файла резервной копии
export function importBackupFile(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    const ok = useStore.getState().importState(String(reader.result ?? ''));
    if (ok) {
      toast(tr(T_COMMON.backupLoaded), tr(T_COMMON.backupLoadedText), '✨');
    } else {
      toast(tr(T_COMMON.backupFailed), tr(T_COMMON.backupFailedText), '⚠️');
    }
  };
  reader.readAsText(file);
}
