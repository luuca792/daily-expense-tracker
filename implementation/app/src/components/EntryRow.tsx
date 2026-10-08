import { ReactNode } from 'react';
import { dayLabel } from '../domain/dates';
import { categoryDisplay } from '../domain/goals';
import { minus, signed } from '../domain/money';
import type { Expense, Income, ISODate, Period, Transfer } from '../domain/types';
import { PALETTE } from './palette';

/** 5.1 day group: "Thứ 4 · 30/09" over its rows */
export function DayBox({ date, children }: { date: ISODate; children: ReactNode }) {
  return (
    <div className="daybox">
      <div className="day">{dayLabel(date)}</div>
      {children}
    </div>
  );
}

/** Expense row, tinted with its category color. Untracked (incl. a deleted goal): dashed "Không danh mục".
 *  R3.4: amounts ≥ the large-expense setting are red. */
export function ExpenseRow({ p, e, large, fresh, onClick }: {
  p: Period; e: Expense; large: number; fresh: boolean; onClick: () => void;
}) {
  const nw = fresh ? ' new' : '';
  const cat = categoryDisplay(p, e.category);
  const amount = <b className={e.amount >= large ? 'hi' : ''}>{minus(e.amount)}</b>;
  if (!cat) {
    return (
      <button className={`it none${nw}`} onClick={onClick}>
        <span className="d">Không danh mục</span>{amount}
      </button>
    );
  }
  const c = PALETTE[cat.color];
  return (
    <button className={`it${nw}`} style={{ background: c.bg }} onClick={onClick}>
      <span className="d">{e.description}</span>
      <span className="tag" style={{ color: c.text }}>{cat.name}</span>
      {amount}
    </button>
  );
}

export function IncomeRow({ i, fresh, onClick }: { i: Income; fresh: boolean; onClick: () => void }) {
  return (
    <button className={`it c-inc${fresh ? ' new' : ''}`} onClick={onClick}>
      <span className="d">{i.description}</span><b>{signed(i.amount)}</b>
    </button>
  );
}

/** Savings transfer in the Thu nhập list: a deposit lowers Thu (−), a withdrawal raises it (+) (R6.3) */
export function TransferRow({ t, fresh, onClick }: { t: Transfer; fresh: boolean; onClick: () => void }) {
  return (
    <button className={`it c-save${fresh ? ' new' : ''}`} onClick={onClick}>
      <span className="d">{t.dir === 'in' ? 'Gửi tiết kiệm' : 'Rút tiết kiệm'}</span>
      <b>{t.dir === 'in' ? minus(t.amount) : signed(t.amount)}</b>
    </button>
  );
}
