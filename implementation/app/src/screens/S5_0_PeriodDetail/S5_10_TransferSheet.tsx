import { useState } from 'react';
import { AmountBox } from '../../components/AmountBox';
import { DateField } from '../../components/DateField';
import { Field, Sheet } from '../../components/Sheet';
import { defaultDate, inPeriod } from '../../domain/entries';
import { money } from '../../domain/money';
import { fundBalance, removalAllowed, removeTransfer, saveTransfer, transferAllowed } from '../../domain/savings';
import { ISODate, Period } from '../../domain/types';
import { useData, useStore } from '../../state/store';

/** 5.10 Savings Transfer: Gửi vào / Rút ra (R6.1–R6.4). The fund shown is without the edited entry. */
export function S5_10_TransferSheet({ p, id, onClose }: { p: Period; id?: string; onClose: () => void }) {
  const d = useData();
  const update = useStore((s) => s.update);
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const existing = p.transfers.find((t) => t.id === id);
  const [dir, setDir] = useState<'in' | 'out'>(existing?.dir ?? 'in'); // D51: Gửi vào by default
  const [amount, setAmount] = useState<number | null>(existing?.amount ?? null);
  const [date, setDate] = useState<ISODate>(existing?.date ?? defaultDate(p));
  const [deleteErr, setDeleteErr] = useState(false);

  const current = fundBalance(d);
  const without = fundBalance(d, existing?.id); // R6.4: the fund without the edited entry
  const overLimit = amount !== null && amount > 0 && !transferAllowed(without, current, dir, amount);
  const valid = amount !== null && amount > 0 && !overLimit && inPeriod(p, date);
  const deleteAllowed = !existing || removalAllowed(without, current);

  function save() {
    if (!valid) return;
    update((dd) => saveTransfer(dd, p.id, { dir, amount, date }, existing?.id));
    onClose();
  }

  return (
    <Sheet title="Tiết kiệm" onClose={onClose}>
      <div className={`seg ${dir === 'out' ? 'second' : ''}`}>
        <button className={dir === 'in' ? 'on' : ''} onClick={() => setDir('in')}>Gửi vào</button>
        <button className={dir === 'out' ? 'on' : ''} onClick={() => setDir('out')}>Rút ra</button>
      </div>
      <div className="row fund-row">
        <span className="s">Quỹ tiết kiệm</span><span className="val fund-val">🐷 {money(without)}</span>
      </div>
      <AmountBox label="Số tiền" accent="amber" value={amount} onChange={setAmount} autoFocus={!existing} />
      {(overLimit || deleteErr) && <div className="err under-amount">Vượt quá quỹ tiết kiệm</div>}
      <Field label="Ngày">
        <DateField value={date} min={p.start} max={p.end} onChange={setDate} />
      </Field>
      <button className="btn pri after-fields" disabled={!valid} onClick={save}>Lưu</button>
      {existing && (
        <button className="text-danger" onClick={() => {
          // R6.4: removing a deposit can't push the fund lower below 0
          if (!deleteAllowed) return setDeleteErr(true);
          updateWithUndo('Đã xóa', (dd) => removeTransfer(dd, p.id, existing.id));
          onClose();
        }}>🗑 Xóa</button>
      )}
    </Sheet>
  );
}
