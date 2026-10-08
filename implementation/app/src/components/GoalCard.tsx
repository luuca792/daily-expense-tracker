import { BarColor, barColor } from '../domain/calc';
import { money } from '../domain/money';
import type { Goal } from '../domain/types';
import { Ico } from './Ico';

/** Goal bar colors (D38) */
export const BAR: Record<BarColor, string> = { yellow: '#EAB308', green: '#22C55E', red: '#E11D48' };

/** Bar width in %: spent / target, capped at 100; a target of 0 is full as soon as anything is spent */
export const pct = (a: number, b: number) => (b <= 0 ? (a > 0 ? 100 : 0) : Math.min(100, (a / b) * 100));

/** 5.2 goal card: icon, name (✓ when done), spent / target and a bar */
export function GoalCard({ g, spent, onClick }: { g: Goal; spent: number; onClick: () => void }) {
  const color = barColor(spent, g.target);
  return (
    <button className={`goal ${g.done ? 'done' : ''}`} onClick={onClick}>
      <div className="row">
        <div className="l">
          <Ico icon={g.icon} color={g.color} strong />
          <b className="goal-name">{g.name}</b>
          {g.done && <b className="goal-done">✓</b>}
        </div>
        <span className="nowrap">
          <b className={color === 'red' ? 'over' : ''}>{money(spent)}</b> <span className="s">/ {money(g.target)}</span>
        </span>
      </div>
      <div className="gbar"><i style={{ width: `${pct(spent, g.target)}%`, background: BAR[color] }} /></div>
    </button>
  );
}
