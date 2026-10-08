import { useState } from 'react';
import { AmountBox } from '../../components/AmountBox';
import { DateField } from '../../components/DateField';
import { Ico } from '../../components/Ico';
import { Field, Sheet } from '../../components/Sheet';
import { defaultDate, inPeriod, removeExpense, saveExpense } from '../../domain/entries';
import { ColorKey, ISODate, LIVING, Period } from '../../domain/types';
import { useStore } from '../../state/store';
import { S5_6_GoalSheet } from './S5_6_GoalSheet';

/** 5.4 Add / Edit Expense; 5.5 is this sheet with "Không DM" picked (no Mô tả field, R3.1) */
export function S5_4_ExpenseSheet({ p, id, onClose }: { p: Period; id?: string; onClose: () => void }) {
  const update = useStore((s) => s.update);
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const [editId, setEditId] = useState(id);
  const existing = p.expenses.find((e) => e.id === editId);
  const [amount, setAmount] = useState<number | null>(existing?.amount ?? null);
  // R3.2, D17: a new expense starts on Sinh hoạt
  const [category, setCategory] = useState<string | null>(existing ? existing.category : LIVING);
  const [description, setDescription] = useState(existing?.description ?? '');
  const [date, setDate] = useState<ISODate>(existing?.date ?? defaultDate(p)); // R3.2
  const [newGoal, setNewGoal] = useState(false);
  const [focusKey, setFocusKey] = useState(0);

  const valid = amount !== null && amount > 0 && inPeriod(p, date); // R3.5

  function save(more: boolean) {
    if (!valid) return;
    update((d) => saveExpense(d, p.id, { amount, category, description, date }, existing?.id));
    if (more) {
      // Lưu & thêm tiếp: stay open in add mode; category and date are kept
      setEditId(undefined);
      setAmount(null);
      setDescription('');
      setFocusKey(focusKey + 1);
    } else onClose();
  }

  // R3.1 tile order: Sinh hoạt, Không DM, the period's goals, then ＋ Mục tiêu mới
  const tiles: { key: string | null; name: string; icon: string; color: ColorKey | null }[] = [
    { key: LIVING, name: 'Sinh hoạt', icon: p.living.icon, color: p.living.color },
    { key: null, name: 'Không DM', icon: '?', color: null },
    ...p.goals.map((g) => ({ key: g.id, name: g.name, icon: g.icon, color: g.color })),
  ];

  return (
    <>
      <Sheet title={existing ? 'Sửa khoản chi' : 'Thêm khoản chi'} onClose={onClose}>
        <AmountBox key={focusKey} label="Số tiền" value={amount} onChange={setAmount} autoFocus={!existing} />
        <span className="lbl">Danh mục</span>
        <div className="cats">
          {tiles.map((t) => (
            <button key={t.key ?? 'none'} className={category === t.key ? 'on' : ''} onClick={() => setCategory(t.key)}>
              <Ico icon={t.icon} color={t.color} size="md" />
              <span className="n">{t.name}</span>
            </button>
          ))}
          <button onClick={() => setNewGoal(true)}>
            <Ico icon="＋" color="slate" size="md" />
            <span className="n">Mục tiêu mới</span>
          </button>
        </div>
        {category !== null && (
          <Field label="Mô tả">
            <input enterKeyHint="done" className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
        )}
        <Field label="Ngày">
          <DateField value={date} min={p.start} max={p.end} onChange={setDate} />
        </Field>
        <div className="btn-row">
          <button className="btn" disabled={!valid} onClick={() => save(true)}>Lưu & thêm tiếp</button>
          <button className="btn pri" disabled={!valid} onClick={() => save(false)}>Lưu</button>
        </div>
        {existing && (
          <button className="text-danger" onClick={() => {
            updateWithUndo('Đã xóa khoản chi', (d) => removeExpense(d, p.id, existing.id));
            onClose();
          }}>Xóa</button>
        )}
      </Sheet>
      {newGoal && (
        <S5_6_GoalSheet p={p} stack onClose={() => setNewGoal(false)} onCreated={(gid) => { setCategory(gid); setNewGoal(false); }} />
      )}
    </>
  );
}
