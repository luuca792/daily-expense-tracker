import { useState } from 'react';
import { DateField } from '../../components/DateField';
import { Field, Sheet } from '../../components/Sheet';
import { activePeriod } from '../../domain/calc';
import { todayISO } from '../../domain/dates';
import { signed } from '../../domain/money';
import { carryOver, closesActive, createPeriod, editPeriod, entriesOutside } from '../../domain/periods';
import { ISODate, Period } from '../../domain/types';
import { useData, useStore } from '../../state/store';
import { S4_3_ClosePeriod } from './S4_3_ClosePeriod';

/**
 * 4.1 Create / Edit Period (plan §2.5). Edit mode: pass `period` (the active period only).
 * Fields: name and start date; no end date field (the app sets `end`). Any start date is allowed;
 * normalizePeriods keeps open / closed periods consistent afterwards.
 */
export function S4_1_PeriodSheet({ period, onClose, onCreated, onDelete }: {
  period?: Period; onClose: () => void; onCreated?: (id: string) => void; onDelete?: () => void;
}) {
  const d = useData();
  const update = useStore((s) => s.update);
  const editing = !!period;
  const [name, setName] = useState(period?.name ?? '');
  const [start, setStart] = useState<ISODate>(period?.start ?? todayISO());
  const [tried, setTried] = useState(false);
  const [confirm, setConfirm] = useState(false);

  // Create: always carried over from the active period (R1.8), which a newer start closes (4.3)
  const active = editing ? null : activePeriod(d);
  const carry = carryOver(active);

  const nameErr = tried && !name.trim() ? 'Chưa nhập tên kỳ' : null;
  // Edit: the start can't move after the period's first entry (R3.5)
  const outside = editing ? entriesOutside(period, start, period.end) : 0;
  const startErr = outside > 0 ? `${outside} khoản nằm ngoài khoảng ngày` : null;

  function save() {
    setTried(true);
    if (!name.trim() || startErr) return;
    if (editing) {
      update((dd) => editPeriod(dd, period.id, { name, start }));
      onClose();
    } else if (closesActive(d, start)) setConfirm(true);
    else create();
  }

  function create() {
    let id = '';
    update((dd) => { id = createPeriod(dd, { name, start }).id; });
    onCreated?.(id);
  }

  return (
    <Sheet title={editing ? 'Sửa kỳ' : 'Tạo kỳ mới'} onClose={onClose}>
      <Field label="Tên kỳ" error={nameErr}>
        <input enterKeyHint="done" className={`input ${nameErr ? 'bad' : ''}`} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Ngày bắt đầu" error={startErr}>
        <DateField value={start} onChange={setStart} bad={!!startErr} />
      </Field>
      {carry !== 0 && (
        <div className={`carry ${carry < 0 ? 'neg' : ''}`}>
          <span>↩️ Còn lại từ tháng trước</span><b>{signed(carry)}</b>
        </div>
      )}
      <button className="btn pri after-fields" onClick={save}>{editing ? 'Lưu' : 'Tạo kỳ'}</button>
      {editing && <button className="text-danger" onClick={onDelete}>Xóa kỳ</button>}
      {confirm && active && <S4_3_ClosePeriod p={active} onCancel={() => setConfirm(false)} onConfirm={create} />}
    </Sheet>
  );
}
