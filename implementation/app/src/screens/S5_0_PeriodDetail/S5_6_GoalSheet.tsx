import { useState } from 'react';
import { AmountBox } from '../../components/AmountBox';
import { BAR, pct } from '../../components/GoalCard';
import { Ico } from '../../components/Ico';
import { COLOR_KEYS, ICONS, PALETTE } from '../../components/palette';
import { Field, Sheet } from '../../components/Sheet';
import { barColor, countOn, livingCount, livingSpent, spentOn } from '../../domain/calc';
import { saveGoal, saveLiving } from '../../domain/goals';
import { money } from '../../domain/money';
import { ColorKey, Period } from '../../domain/types';
import { useStore } from '../../state/store';
import { S5_7_DeleteGoal } from './S5_7_DeleteGoal';

/**
 * 5.6 Add / Edit Goal. id = goal id (edit) · 'living' (Sinh hoạt mode, D47: name fixed, target = maximum) ·
 * undefined (create). Changes apply to this period only (R2.1).
 */
export function S5_6_GoalSheet({ p, id, onClose, onCreated, stack }: {
  p: Period; id?: string; onClose: () => void; onCreated?: (id: string) => void; stack?: boolean;
}) {
  const update = useStore((s) => s.update);
  const isLiving = id === 'living';
  const goal = p.goals.find((g) => g.id === id);
  const creating = !isLiving && !goal;
  const src = isLiving ? { name: 'Sinh hoạt', icon: p.living.icon, color: p.living.color, target: p.living.max } : goal;
  const [name, setName] = useState(src?.name ?? '');
  // new goal defaults
  const [icon, setIcon] = useState(src?.icon ?? '✨');
  const [color, setColor] = useState<ColorKey>(src?.color ?? 'slate');
  const [target, setTarget] = useState<number | null>(src?.target ?? null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const valid = (isLiving || name.trim() !== '') && target !== null && target >= 0;

  function save(toggleDone = false) {
    if (!valid) return;
    let newId: string | null = null;
    update((d) => {
      if (isLiving) saveLiving(d, p.id, { icon, color, max: target });
      else newId = saveGoal(d, p.id, { name, icon, color, target }, goal?.id, toggleDone);
    });
    if (creating && onCreated && newId) onCreated(newId);
    else onClose();
  }

  const spent = isLiving ? livingSpent(p).total : goal ? spentOn(p, goal.id) : 0;
  const count = isLiving ? livingCount(p) : goal ? countOn(p, goal.id) : 0;
  const bar = barColor(spent, target ?? 0);

  return (
    <>
      <Sheet title={creating ? 'Thêm mục tiêu' : 'Sửa mục tiêu'} onClose={onClose} stack={stack}>
        <div className="goal-head">
          <div className="goal-head-ico"><Ico icon={icon} color={color} size="lg" /></div>
          <div className="grow">
            <Field label="Tên danh mục">
              {isLiving ? <div className="input ro">Sinh hoạt</div>
                : <input enterKeyHint="done" className="input" value={name} autoFocus={creating} onChange={(e) => setName(e.target.value)} />}
            </Field>
          </div>
        </div>
        <span className="lbl">Biểu tượng & màu:</span>
        <div className="swatches">
          {COLOR_KEYS.map((k) => (
            <button key={k} className={k === color ? 'on' : ''} style={{ background: PALETTE[k].solid }} onClick={() => setColor(k)} aria-label={k} />
          ))}
        </div>
        <div className="icons">
          {ICONS.map((ic) => <button key={ic} className={ic === icon ? 'on' : ''} onClick={() => setIcon(ic)}>{ic}</button>)}
        </div>
        <AmountBox label={isLiving ? 'Mức tối đa kỳ này' : 'Mục tiêu kỳ này'} value={target} onChange={setTarget} />
        {!creating && (
          <div className="info-card">
            <div className="row"><span className="s">Đã chi trong kỳ</span><span><b>{money(spent)}</b> · {count} khoản</span></div>
            <div className="gbar"><i style={{ width: `${pct(spent, target ?? 0)}%`, background: BAR[bar] }} /></div>
          </div>
        )}
        <button className="btn pri" disabled={!valid} onClick={() => save()}>Lưu</button>
        {goal && (
          <>
            <button className="btn ok spaced" disabled={!valid} onClick={() => save(true)}>
              {goal.done ? '↺ Mở lại mục tiêu' : '✓ Hoàn thành mục tiêu'}
            </button>
            <button className="text-danger" onClick={() => setConfirmDelete(true)}>🗑 Xóa mục tiêu này</button>
          </>
        )}
      </Sheet>
      {confirmDelete && goal && <S5_7_DeleteGoal p={p} goalId={goal.id} onCancel={() => setConfirmDelete(false)} onDeleted={onClose} />}
    </>
  );
}
