import { Ico } from '../components/ui';
import { BarColor, barColor, goalTotals, livingSpent, spentOn } from '../domain/calc';
import { money } from '../domain/format';
import { PALETTE } from '../domain/palette';
import { Period } from '../domain/types';
import type { SheetState } from './S5_0_PeriodDetail';

export const BAR: Record<BarColor, string> = { yellow: '#EAB308', green: '#22C55E', red: '#E11D48' };
const pct = (a: number, b: number) => (b <= 0 ? (a > 0 ? 100 : 0) : Math.min(100, (a / b) * 100));

export function S5_2_Goals({ p, open }: { p: Period; open: (s: SheetState) => void }) {
  const living = livingSpent(p);
  const max = p.living.max;
  const over = living.total > max;
  const catW = pct(living.categorized, Math.max(max, living.total));
  const untW = pct(living.untracked, Math.max(max, living.total));
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
          <i style={{ width: `${catW}%`, background: over ? BAR.red : lc.solid }} />
          <i style={{ width: `${untW}%`, background: `repeating-linear-gradient(45deg, ${lc.solid} 0 3px, ${lc.bg} 3px 6px)` }} />
        </div>
      </button>

      <div className="s" style={{ padding: '0 2px 8px' }}>
        Đã chi <b style={{ color: '#0f172a' }}>{money(totals.spent)}</b> / mục tiêu <b style={{ color: '#0f172a' }}>{money(totals.target)}</b>
      </div>

      {p.goals.map((g) => {
        const spent = spentOn(p, g.id);
        const color = barColor(spent, g.target);
        return (
          <button key={g.id} className={`goal ${g.done ? 'done' : ''}`} onClick={() => open({ k: 'goal', id: g.id })}>
            <div className="row">
              <div className="l">
                <Ico icon={g.icon} color={g.color} strong />
                <b style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</b>
                {g.done && <b style={{ color: '#16a34a' }}>✓</b>}
              </div>
              <span style={{ whiteSpace: 'nowrap' }}>
                <b className={color === 'red' ? 'over' : ''}>{money(spent)}</b> <span className="s">/ {money(g.target)}</span>
              </span>
            </div>
            <div className="gbar"><i style={{ width: `${pct(spent, g.target)}%`, background: BAR[color] }} /></div>
          </button>
        );
      })}
    </div>
  );
}
