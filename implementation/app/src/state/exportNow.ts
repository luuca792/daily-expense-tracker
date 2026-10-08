// 6.0 Xuất dữ liệu (plan §4.6): export the store's (current, validated) data, then remember the date.
import { exportData } from '../data/export';
import { getRepository } from '../data/repository';
import { useStore } from './store';

export const EXPORTED_TEXT = 'Đã xuất dữ liệu';

export async function exportNow(repo = getRepository()) {
  const { data } = useStore.getState();
  if (!data) return;
  const r = await exportData(data);
  if (r === 'cancelled') return;
  const now = Date.now();
  useStore.getState().setLastExportAt(now);
  useStore.getState().showToast(EXPORTED_TEXT);
  await repo.setLastExportAt(now).catch(() => undefined); // only the 6.0 date is lost if this fails
}
