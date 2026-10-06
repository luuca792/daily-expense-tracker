import { useRef, useState } from 'react';
import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import { Ring } from '../components/ui';
import { chi, goalSegments, livingSpent } from '../domain/calc';
import { todayISO } from '../domain/entries';
import { money } from '../domain/format';
import { PALETTE } from '../domain/palette';
import { LIVING, Period } from '../domain/types';

export function S5_3_Statistics({ p }: { p: Period }) {
  const [page, setPageRaw] = useState(0);
  const [dir, setDir] = useState('');
  const setPage = (n: number) => { setDir(n > page ? 'from-r' : 'from-l'); setPageRaw(n); };
  const touchX = useRef<number | null>(null);
  const last = 1;
  return (
    <div
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx < -50 && page < last) setPage(page + 1);
        if (dx > 50 && page > 0) setPage(page - 1);
        touchX.current = null;
      }}
    >
      <div className="carousel">
        <div key={page} className={`slide ${dir}`}>{page === 0 ? <LivingRing p={p} /> : <GoalsRing p={p} />}</div>
        {page > 0 && <button className="nav l" onClick={() => setPage(page - 1)}>‹</button>}
        {page < last && <button className="nav r" onClick={() => setPage(page + 1)}>›</button>}
      </div>
      <div key={page} className={`slide ${dir}`}>{page === 0 ? <LivingDetails p={p} /> : <GoalsDetails p={p} />}</div>
    </div>
  );
}

// Chart 1 · "Danh mục & không danh mục"
function LivingRing({ p }: { p: Period }) {
  const l = livingSpent(p);
  const max = p.living.max;
  const base = Math.max(max, l.total) || 1;
  const c = PALETTE[p.living.color];
  return (
    <Ring segments={[{ value: l.categorized / base, color: c.solid }, { value: l.untracked / base, color: c.solid + '70' }]}>
      <div className="s">Đã chi</div>
      <div className="v">{money(l.total)}</div>
      <div className="s">/ {money(max)} · {max > 0 ? Math.round((l.total / max) * 100) : 0}%</div>
    </Ring>
  );
}

function LivingDetails({ p }: { p: Period }) {
  const left = p.living.max - livingSpent(p).total;
  // one bar per day of the period; an open period runs to today
  const endDay = p.end ?? (todayISO() > p.start ? todayISO() : p.start);
  const days = differenceInCalendarDays(parseISO(endDay), parseISO(p.start)) + 1;
  const dates = Array.from({ length: days }, (_, i) => format(addDays(parseISO(p.start), i), 'yyyy-MM-dd'));
  const perDay = dates.map((dt) =>
    p.expenses.filter((e) => e.date === dt && (e.category === LIVING || e.category === null)).reduce((a, e) => a + e.amount, 0),
  );
  const top = Math.max(...perDay, 1);
  const lbl = (dt: string) => format(parseISO(dt), 'd/M');
  return (
    <>
      <div className="chart-name">Danh mục & không danh mục</div>
      <div className={`good ${left < 0 ? 'neg' : ''}`}><span>Còn lại</span><b style={{ fontSize: 17 }}>{money(left)}</b></div>
      <div className="lbl" style={{ margin: '14px 0 4px' }}>Chi sinh hoạt theo ngày</div>
      <div className="minibars">
        {perDay.map((v, i) => <i key={i} style={{ height: `${(v / top) * 100}%`, animationDelay: `${Math.min(i * 12, 360)}ms` }} />)}
      </div>
      <div className="s" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{lbl(dates[0])}</span>
        {days > 2 && <span>{lbl(dates[Math.floor((days - 1) / 2)])}</span>}
        {days > 1 && <span>{lbl(dates[days - 1])}</span>}
      </div>
    </>
  );
}

// Chart 2 · "Mục tiêu" (R4.1). Segments and legend dots use each goal's solid color (the pale bg was too hard to tell apart)
function GoalsRing({ p }: { p: Period }) {
  const total = chi(p);
  const segs = goalSegments(p);
  return (
    <Ring segments={segs.map((s) => ({ value: total ? s.amount / total : 0, color: PALETTE[s.color].solid }))}>
      <div className="s">Đã chi</div>
      <div className="v">{money(total)}</div>
    </Ring>
  );
}

function GoalsDetails({ p }: { p: Period }) {
  return (
    <>
      <div className="chart-name">Mục tiêu</div>
      <div className="pie-legend">
        {goalSegments(p).map((s) => (
          <div key={s.key}>
            <span className="dot" style={{ background: PALETTE[s.color].solid }} />
            <span className="n">{s.name}</span><b>{money(s.amount)}</b>
          </div>
        ))}
      </div>
    </>
  );
}
