import { BAR, GoalCard, pct } from '../../components/GoalCard';
import { PALETTE } from '../../components/palette';
import { goalTotals, livingSpent, spentOn } from '../../domain/calc';
import { money } from '../../domain/money';
import { Period } from '../../domain/types';
import type { SheetState } from './S5_0_PeriodDetail';

/** 5.2 Goals: the Sinh hoạt card (categorized + hatched untracked part, red when over the maximum), totals, goal cards */
export function S5_2_Goals({ p, open }: { p: Period; open: (s: SheetState) => void }) {
  const living = livingSpent(p);
  const max = p.living.max;
  const over = living.total > max;
  // both parts share one scale: the larger of the maximum and what was spent
  const scale = Math.max(max, living.total);
  const totals = goalTotals(p);
  const lc = PALETTE[p.living.color];

  return (
    <div className="stagger">
      <button className="living" style={{ background: lc.bg, borderColor: lc.solid + '80' }} onClick={() => open({ k: 'goal', id: 'living' })}>
        <div className="row">
          <b>{p.living.icon} Sinh hoạt</b>
          <span><b className={over ? 'over' : ''}>{money(living.total)}</b> <span className="s">/ {money(max)}</span></span>
        </div>
        <div className="lbar" style={{ borderColor: lc.solid + '80' }}>
          <i style={{ width: `${pct(living.categorized, scale)}%`, background: over ? BAR.red : lc.solid }} />
          <i style={{ width: `${pct(living.untracked, scale)}%`, background: `repeating-linear-gradient(45deg, ${lc.solid} 0 3px, ${lc.bg} 3px 6px)` }} />
        </div>
      </button>

      <div className="s goal-totals">
        Đã chi <b>{money(totals.spent)}</b> / mục tiêu <b>{money(totals.target)}</b>
      </div>

      {p.goals.map((g) => (
        <GoalCard key={g.id} g={g} spent={spentOn(p, g.id)} onClick={() => open({ k: 'goal', id: g.id })} />
      ))}
    </div>
  );
}
