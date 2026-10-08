import { useState } from 'react';
import { AmountBox, Dialog, Field, Ico, Sheet } from '../components/ui';
import { barColor, countOn, livingCount, livingSpent, spentOn } from '../domain/calc';
import { money } from '../domain/format';
import { COLOR_KEYS, ICONS, PALETTE } from '../domain/palette';
import { deleteGoal } from '../domain/periods';
import { ColorKey, Period, uid } from '../domain/types';
import { useStore } from '../store/store';
import { BAR } from './S5_2_Goals';

/**
 * 5.6 Edit Goal. id = goal id (edit) · 'living' (Sinh hoạt mode, D47) · undefined (create mode).
 * Changes apply to this period only (R2.1).
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
  const [icon, setIcon] = useState(src?.icon ?? '✨');
  const [color, setColor] = useState<ColorKey>(src?.color ?? 'slate');
  const [target, setTarget] = useState<number | null>(src?.target ?? null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const valid = (isLiving || name.trim() !== '') && target !== null && target >= 0;

  function save(toggleDone = false) {
    if (!valid) return;
    const newId = uid();
    update((d) => {
      const pp = d.periods.find((x) => x.id === p.id)!;
      if (isLiving) Object.assign(pp.living, { icon, color, max: target });
      else if (goal) {
        const g = pp.goals.find((x) => x.id === goal.id)!;
        Object.assign(g, { name: name.trim(), icon, color, target, done: toggleDone ? !g.done : g.done });
      } else pp.goals.push({ id: newId, name: name.trim(), icon, color, target: target!, done: false }); // R2.4: at the end
    });
    if (creating && onCreated) onCreated(newId);
    else onClose();
  }

  const spent = isLiving ? livingSpent(p).total : goal ? spentOn(p, goal.id) : 0;
  const count = isLiving ? livingCount(p) : goal ? countOn(p, goal.id) : 0;
  const bar = barColor(spent, target ?? 0);

  return (
    <>
      <Sheet title={creating ? 'Thêm mục tiêu' : 'Sửa mục tiêu'} onClose={onClose} stack={stack}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 6 }}>
          <div style={{ marginBottom: 10 }}><Ico icon={icon} color={color} size="lg" /></div>
          <div style={{ flex: 1 }}>
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
            <div className="gbar"><i style={{ width: `${Math.min(100, target ? (spent / target) * 100 : spent > 0 ? 100 : 0)}%`, background: BAR[bar] }} /></div>
          </div>
        )}
        <button className="btn pri" disabled={!valid} onClick={() => save()}>Lưu</button>
        {goal && (
          <>
            <button className="btn ok" style={{ marginTop: 8 }} disabled={!valid} onClick={() => save(true)}>
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

/** 5.7 Delete Goal: entries move to Sinh hoạt (R2.3) */
function S5_7_DeleteGoal({ p, goalId, onCancel, onDeleted }: { p: Period; goalId: string; onCancel: () => void; onDeleted: () => void }) {
  const updateWithUndo = useStore((s) => s.updateWithUndo);
  const g = p.goals.find((x) => x.id === goalId)!;
  return (
    <Dialog onClose={onCancel}>
      <div className="ic">🗑</div>
      <div className="title">Xóa mục tiêu “{g.name}”?</div>
      <div className="move-box">
        <Ico icon={g.icon} color={g.color} />
        <span><b>{countOn(p, g.id)} khoản</b> ({money(spentOn(p, g.id))})</span>
        <span style={{ color: '#94a3b8' }}>→</span>
        <Ico icon={p.living.icon} color={p.living.color} />
        <b>Sinh hoạt</b>
      </div>
      <div className="btn-row">
        <button className="btn" onClick={onCancel}>Hủy</button>
        <button className="btn danger" onClick={() => {
          updateWithUndo('Đã xóa mục tiêu', (d) => deleteGoal(d.periods.find((x) => x.id === p.id)!, g.id));
          onDeleted();
        }}>Xóa</button>
      </div>
    </Dialog>
  );
}
