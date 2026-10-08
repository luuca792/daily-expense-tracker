import { useState } from 'react';
import { DateField, Dialog, Field, Sheet } from '../components/ui';
import { activePeriod } from '../domain/calc';
import { todayISO } from '../domain/entries';
import { signed } from '../domain/format';
import { carryOver, closesActive, createPeriod, entriesOutside, normalizePeriods } from '../domain/periods';
import { ISODate, Period } from '../domain/types';
import { useData, useStore } from '../store/store';

/**
 * 4.1 Create / Edit Period. Edit mode: pass `period` (only the active period can be edited).
 * No end date field: a period stays open until the next one is created, which closes it (4.3).
 */
export function S4_1_PeriodSheet({ period, onClose, onCreated, onDelete }: {
  period?: Period; onClose: () => void; onCreated?: (id: string) => void; onDelete?: () => void;
}) {
  const d = useData();
  const update = useStore((s) => s.update);
  const editing = !!period;
  const [name, setName] = useState(period?.name ?? '');
  const [start, setStart] = useState<ISODate | null>(period?.start ?? todayISO());
  const [tried, setTried] = useState(false);
  const [confirm, setConfirm] = useState(false);

  // Create: carried over from the active period, which this closes (R1.8); no choice of period
  const active = editing ? null : activePeriod(d);
  const carry = carryOver(active);

  // Start dates are free (2026-10-08); normalizePeriods keeps open/closed periods consistent afterwards
  const nameErr = tried && !name.trim() ? 'Chưa nhập tên kỳ' : null;
  const outside = editing && start ? entriesOutside(period, start, period.end) : 0;
  const startErr =
    tried && !start ? 'Chưa chọn ngày'
      : outside > 0 ? `${outside} khoản nằm ngoài khoảng ngày` : null;

  function save() {
    setTried(true);
    if (!name.trim() || !start || startErr) return;
    if (editing) {
      update((dd) => {
        const p = dd.periods.find((x) => x.id === period.id)!;
        Object.assign(p, { name: name.trim(), start });
        normalizePeriods(dd);
      });
      onClose();
    } else if (closesActive(d, start)) setConfirm(true);
    else create();
  }

  function create() {
    let id = '';
    update((dd) => { id = createPeriod(dd, { name, start: start! }).id; });
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
      <button className="btn pri" style={{ marginTop: 12 }} onClick={save}>{editing ? 'Lưu' : 'Tạo kỳ'}</button>
      {editing && <button className="text-danger" onClick={onDelete}>Xóa kỳ</button>}
      {confirm && active && <S4_3_ClosePeriod p={active} onCancel={() => setConfirm(false)} onConfirm={create} />}
    </Sheet>
  );
}

/** 4.3 Close Period: creating a period closes the active one (it becomes read-only history) */
function S4_3_ClosePeriod({ p, onCancel, onConfirm }: { p: Period; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Dialog onClose={onCancel}>
      <div className="ic" style={{ background: '#ccfbf1' }}>🔒</div>
      <div className="title">Đóng kỳ “{p.name}”?</div>
      <div className="btn-row">
        <button className="btn" onClick={onCancel}>Hủy</button>
        <button className="btn pri" onClick={onConfirm}>Tạo kỳ</button>
      </div>
    </Dialog>
  );
}
