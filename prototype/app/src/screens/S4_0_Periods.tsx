import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, Header } from '../components/ui';
import { activePeriod, chi, entryCount, thu } from '../domain/calc';
import { todayISO } from '../domain/entries';
import { fmtDate, money } from '../domain/format';
import { defaultOpenYear, yearGroups } from '../domain/periods';
import { Period } from '../domain/types';
import { useData } from '../store/store';
import { S4_1_PeriodSheet } from './S4_1_PeriodSheet';

/** R1.4: "dd/MM/yyyy → dd/MM/yyyy" or "→ chưa kết thúc" */
export function PeriodDates({ p }: { p: Period }) {
  return (
    <div className="dates">
      {fmtDate(p.start)} → {p.end ? fmtDate(p.end) : <i>chưa kết thúc</i>}
    </div>
  );
}

export function S4_0_Periods() {
  const nav = useNavigate();
  const d = useData();
  const groups = yearGroups(d.periods);
  const active = activePeriod(d);
  const [open, setOpen] = useState<Record<number, boolean>>(() => {
    const y = defaultOpenYear(groups.map((g) => g.year), todayISO());
    return y ? { [y]: true } : {};
  });
  const [creating, setCreating] = useState(false);

  return (
    <>
      <Header title="Ghi chép" onBack={() => nav('/')} />
      <div className="page">
        <button className="btn pri" style={{ marginBottom: 8 }} onClick={() => setCreating(true)}>＋ Tạo kỳ mới</button>
        {groups.map((g) => (
          <div key={g.year} className="stagger">
            <button className="year" onClick={() => setOpen({ ...open, [g.year]: !open[g.year] })}>
              <b>{g.year}</b><span>{open[g.year] ? '▾' : '▸'}</span>
            </button>
            {open[g.year] && g.periods.map((p) => {
              const t = thu(p);
              return (
                <button key={p.id} className={`mcard period ${p.id === active?.id ? 'now' : ''}`} onClick={() => nav(`/p/${p.id}/log`)}>
                  <span className="mnum"><CalendarIcon /></span>
                  <span className="body">
                    <div className="name">{p.name}</div>
                    <PeriodDates p={p} />
                    <div className="s">
                      {t > 0 && <><span className="inc">+{money(t)}</span> · </>}
                      <span className="exp">−{money(chi(p))}</span> · {entryCount(p)} khoản
                    </div>
                  </span>
                  <span className="arr">›</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {creating && (
        <S4_1_PeriodSheet onClose={() => setCreating(false)} onCreated={(id) => nav(`/p/${id}/log`)} />
      )}
    </>
  );
}
