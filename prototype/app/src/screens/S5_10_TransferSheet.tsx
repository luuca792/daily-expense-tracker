import { useState } from 'react';
import { AmountBox, DateField, Field, Sheet } from '../components/ui';
import { fundBalance, removalAllowed, transferAllowed } from '../domain/calc';
import { defaultDate, inPeriod } from '../domain/entries';
import { money } from '../domain/format';
import { ISODate, Period, uid } from '../domain/types';
import { useData, useStore } from '../store/store';

/** 5.10 Savings Transfer (R6.1–R6.4) */
export function S5_10_TransferSheet({ p, id, onClose }: { p: Period; id?: string; onClose: () => void }) {
  const d = useData();
  const update = useStore((s) => s.update);
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const existing = p.transfers.find((t) => t.id === id);
  const [dir, setDir] = useState<'in' | 'out'>(existing?.dir ?? 'in'); // D51: Gửi vào by default
  const [amount, setAmount] = useState<number | null>(existing?.amount ?? null);
  const [date, setDate] = useState<ISODate>(existing?.date ?? defaultDate(p));

  const current = fundBalance(d);
  const without = fundBalance(d, existing?.id); // R6.4: the fund without the edited entry
  const overLimit = amount !== null && amount > 0 && !transferAllowed(without, current, dir, amount);
  const valid = amount !== null && amount > 0 && !overLimit && inPeriod(p, date);
  const deleteAllowed = !existing || removalAllowed(without, current);
  const [deleteErr, setDeleteErr] = useState(false);

  function save() {
    if (!valid) return;
    update((dd) => {
      const pp = dd.periods.find((x) => x.id === p.id)!;
      if (existing) Object.assign(pp.transfers.find((t) => t.id === existing.id)!, { dir, amount, date });
      else pp.transfers.push({ id: uid(), dir, amount: amount!, date, createdAt: Date.now() });
    });
    onClose();
  }

  return (
    <Sheet title="Tiết kiệm" onClose={onClose}>
      <div className={`seg ${dir === 'out' ? 'second' : ''}`}>
        <button className={dir === 'in' ? 'on' : ''} onClick={() => setDir('in')}>Gửi vào</button>
        <button className={dir === 'out' ? 'on' : ''} onClick={() => setDir('out')}>Rút ra</button>
      </div>
      <div className="row" style={{ padding: '2px 2px 6px' }}>
        <span className="s">Quỹ tiết kiệm</span><span className="val" style={{ color: '#b45309' }}>🐷 {money(without)}</span>
      </div>
      <AmountBox label="Số tiền" accent="amber" value={amount} onChange={setAmount} autoFocus={!existing} />
      {(overLimit || deleteErr) && <div className="err" style={{ margin: '-6px 2px 8px' }}>Vượt quá quỹ tiết kiệm</div>}
      <Field label="Ngày">
        <DateField value={date} min={p.start} max={p.end ?? undefined} onChange={(v) => v && setDate(v)} />
      </Field>
      <button className="btn pri" style={{ marginTop: 12 }} disabled={!valid} onClick={save}>Lưu</button>
      {existing && (
        <button className="text-danger" onClick={() => {
          if (!deleteAllowed) return setDeleteErr(true);
          updateWithUndo('Đã xóa', (dd) => {
            const pp = dd.periods.find((x) => x.id === p.id)!;
            pp.transfers = pp.transfers.filter((t) => t.id !== existing.id);
          });
          onClose();
        }}>🗑 Xóa</button>
      )}
    </Sheet>
  );
}
