import { useState } from 'react';
import { Header } from '../../components/Header';
import { useBack } from '../../components/useBack';
import { fmtDate, todayISO } from '../../domain/dates';
import { money } from '../../domain/money';
import { Settings } from '../../domain/types';
import { exportNow } from '../../state/exportNow';
import { useData, useStore } from '../../state/store';
import { S6_1_SettingSheet } from './S6_1_SettingSheet';

export const SETTING_ROWS: { section: string; key: keyof Settings; label: string }[] = [
  { section: '🍜 Sinh hoạt', key: 'livingMax', label: 'Mức sinh hoạt tối đa mong đợi' },
  { section: '⚠️ Cảnh báo', key: 'largeFrom', label: 'Tô màu khoản chi lớn từ' },
];

/** 6.0 Settings: the two amounts (→ 6.1), then 💾 Dữ liệu · Xuất dữ liệu (plan §4.6): tapping exports right away;
 *  its value is the date of the last export, or —. The app version (package.json, "x.y.z") sits at the bottom center */
export function S6_0_Settings() {
  const back = useBack('/');
  const d = useData();
  const lastExportAt = useStore((s) => s.lastExportAt);
  const [editing, setEditing] = useState<keyof Settings | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <Header title="Cài đặt" onBack={back} />
      <div className="page">
        {SETTING_ROWS.map((r) => (
          <div key={r.key}>
            <div className="set-sec">{r.section}</div>
            <div className="set">
              <button onClick={() => setEditing(r.key)}><span>{r.label}</span><span className="val">{money(d.settings[r.key])} ›</span></button>
            </div>
          </div>
        ))}
        <div className="set-sec">💾 Dữ liệu</div>
        <div className="set">
          <button disabled={busy} onClick={async () => {
            setBusy(true);
            try { await exportNow(); } finally { setBusy(false); }
          }}>
            <span>Xuất dữ liệu</span>
            <span className="val">{lastExportAt === null ? '—' : fmtDate(todayISO(new Date(lastExportAt)))}</span>
          </button>
        </div>
      </div>
      <div className="app-ver">{__APP_VERSION__}</div>
      {editing && (
        <S6_1_SettingSheet k={editing} label={SETTING_ROWS.find((r) => r.key === editing)!.label} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
