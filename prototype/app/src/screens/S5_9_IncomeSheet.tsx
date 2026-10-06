import { useState } from 'react';
import { AmountBox, DateField, Field, Sheet } from '../components/ui';
import { defaultDate, inPeriod } from '../domain/entries';
import { ISODate, Period, uid } from '../domain/types';
import { useStore } from '../store/store';

/** 5.9 Add / Edit Income (built from the proposed spec). The amount may be negative (D60). */
export function S5_9_IncomeSheet({ p, id, onClose }: { p: Period; id?: string; onClose: () => void }) {
  const update = useStore((s) => s.update);
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const [editId, setEditId] = useState(id);
  const existing = p.incomes.find((e) => e.id === editId);
  const [amount, setAmount] = useState<number | null>(existing?.amount ?? null);
  const [description, setDescription] = useState(existing?.description ?? '');
  const [date, setDate] = useState<ISODate>(existing?.date ?? defaultDate(p)); // R3.2
  const [focusKey, setFocusKey] = useState(0);

  const valid = amount !== null && amount !== 0 && inPeriod(p, date); // R3.5

  function save(more: boolean) {
    if (!valid) return;
    update((d) => {
      const pp = d.periods.find((x) => x.id === p.id)!;
      if (existing) Object.assign(pp.incomes.find((e) => e.id === existing.id)!, { amount, description: description.trim(), date });
      else pp.incomes.push({ id: uid(), amount: amount!, description: description.trim(), date, createdAt: Date.now() });
    });
    if (more) {
      setEditId(undefined);
      setAmount(null);
      setDescription('');
      setFocusKey(focusKey + 1);
    } else onClose();
  }

  return (
    <Sheet title={existing ? 'Sửa thu nhập' : 'Thêm thu nhập'} onClose={onClose}>
      <AmountBox key={focusKey} label="Số tiền" accent="green" allowNegative value={amount} onChange={setAmount} autoFocus={!existing} />
      <Field label="Mô tả">
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Field>
      <Field label="Ngày">
        <DateField value={date} min={p.start} max={p.end ?? undefined} onChange={(v) => v && setDate(v)} />
      </Field>
      <div className="btn-row">
        <button className="btn" disabled={!valid} onClick={() => save(true)}>Lưu & thêm tiếp</button>
        <button className="btn pri" disabled={!valid} onClick={() => save(false)}>Lưu</button>
      </div>
      {existing && (
        <button className="text-danger" onClick={() => {
          updateWithUndo('Đã xóa thu nhập', (d) => {
            const pp = d.periods.find((x) => x.id === p.id)!;
            pp.incomes = pp.incomes.filter((e) => e.id !== existing.id);
          });
          onClose();
        }}>Xóa</button>
      )}
    </Sheet>
  );
}
