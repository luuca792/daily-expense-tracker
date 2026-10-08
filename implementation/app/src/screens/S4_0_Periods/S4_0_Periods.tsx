import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { CalendarIcon } from '../../components/icons';
import { PeriodDates } from '../../components/PeriodDates';
import { activePeriod, chi, entryCount, thu } from '../../domain/calc';
import { todayISO } from '../../domain/dates';
import { money } from '../../domain/money';
import { defaultOpenYear, yearGroups } from '../../domain/periods';
import { useData } from '../../state/store';
import { S4_1_PeriodSheet } from './S4_1_PeriodSheet';

/** 4.0 Periods: ＋ Tạo kỳ mới, then year groups (R1.1–R1.3); the active period's tile is highlighted */
export function S4_0_Periods() {
  const nav = useNavigate();
  const d = useData();
  const groups = yearGroups(d.periods);
  const active = activePeriod(d);
  // R1.2: only the current year (else the newest) starts expanded
  const [open, setOpen] = useState<Record<number, boolean>>(() => {
    const y = defaultOpenYear(groups.map((g) => g.year), todayISO());
    return y ? { [y]: true } : {};
  });
  const [creating, setCreating] = useState(false);

  return (
    <>
      <Header title="Ghi chép" onBack={() => nav('/')} />
      <div className="page">
        <button className="btn pri top" onClick={() => setCreating(true)}>＋ Tạo kỳ mới</button>
        {groups.map((g) => (
          <div key={g.year} className="stagger">
            <button className="year" onClick={() => setOpen({ ...open, [g.year]: !open[g.year] })}>
              <b>{g.year}</b><span>{open[g.year] ? '▾' : '▸'}</span>
            </button>
            {open[g.year] && g.periods.map((p) => {
              const t = thu(p);
              return (
                <button key={p.id} className={`mcard period ${p.id === active?.id ? 'now' : ''}`} onClick={() => nav(`/periods/${p.id}/log`)}>
                  <span className="mnum"><CalendarIcon /></span>
                  <span className="body">
                    <div className="name">{p.name}</div>
                    <PeriodDates p={p} />
                    <div className="s">
                      {/* Thu shown only when > 0 */}
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
        <S4_1_PeriodSheet onClose={() => setCreating(false)} onCreated={(id) => nav(`/periods/${id}/log`)} />
      )}
    </>
  );
}
