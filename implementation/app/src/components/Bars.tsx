import { format, parseISO } from 'date-fns';
import type { ISODate } from '../domain/types';

/** 5.3 per-day mini bar chart, scaled to the highest day, with first / middle / last day labels */
export function Bars({ days }: { days: { date: ISODate; amount: number }[] }) {
  const top = Math.max(...days.map((d) => d.amount), 1);
  const lbl = (dt: ISODate) => format(parseISO(dt), 'd/M');
  const n = days.length;
  return (
    <>
      <div className="minibars">
        {days.map((d, i) => (
          <i key={d.date} style={{ height: `${(d.amount / top) * 100}%`, animationDelay: `${Math.min(i * 12, 360)}ms` }} />
        ))}
      </div>
      <div className="s bars-axis">
        <span>{lbl(days[0].date)}</span>
        {n > 2 && <span>{lbl(days[Math.floor((n - 1) / 2)].date)}</span>}
        {n > 1 && <span>{lbl(days[n - 1].date)}</span>}
      </div>
    </>
  );
}
