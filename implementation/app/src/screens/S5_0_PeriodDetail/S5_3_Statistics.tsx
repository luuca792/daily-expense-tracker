import { useRef, useState } from 'react';
import { Bars } from '../../components/Bars';
import { PALETTE } from '../../components/palette';
import { Ring } from '../../components/Ring';
import { chi, goalSegments, livingPerDay, livingSpent } from '../../domain/calc';
import { money } from '../../domain/money';
import { Period } from '../../domain/types';

/** 5.3 Statistics: two charts in a carousel (‹ › or swipe): 1 Sinh hoạt vs maximum, 2 spending per goal (R4.1) */
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
        // a horizontal swipe of more than 50px changes the chart
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

// Chart 1 · "Danh mục & không danh mục": Sinh hoạt (solid) and untracked (faded) against the maximum
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
  return (
    <>
      <div className="chart-name">Danh mục & không danh mục</div>
      <div className={`good ${left < 0 ? 'neg' : ''}`}><span>Còn lại</span><b className="good-v">{money(left)}</b></div>
      <div className="lbl bars-title">Chi sinh hoạt theo ngày</div>
      <Bars days={livingPerDay(p)} />
    </>
  );
}

// Chart 2 · "Mục tiêu" (R4.1). Segments and legend dots use each goal's solid color (the pale bg was too hard to tell apart)
function GoalsRing({ p }: { p: Period }) {
  const total = chi(p);
  return (
    <Ring segments={goalSegments(p).map((s) => ({ value: total ? s.amount / total : 0, color: PALETTE[s.color].solid }))}>
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
