import { useState } from 'react';
import { DateField, Field, Sheet } from '../components/ui';
import { sortPeriods } from '../domain/calc';
import { todayISO } from '../domain/entries';
import { signed } from '../domain/format';
import { buildPeriod, carryOver, defaultPrevious, entriesOutside } from '../domain/periods';
import { ISODate, Period } from '../domain/types';
import { useData, useStore } from '../store/store';

const NONE = 'none';

/** 4.1 Create / Edit Period. Edit mode: pass `period`. */
export function S4_1_PeriodSheet({ period, onClose, onCreated, onDelete }: {
  period?: Period; onClose: () => void; onCreated?: (id: string) => void; onDelete?: () => void;
}) {
  const d = useData();
  const update = useStore((s) => s.update);
  const editing = !!period;
  const [name, setName] = useState(period?.name ?? '');
  const [start, setStart] = useState<ISODate | null>(period?.start ?? todayISO());
  const [end, setEnd] = useState<ISODate | null>(period?.end ?? null);
  // R1.6: default = nearest period, recomputed with the start date until the user picks one
  const [picked, setPicked] = useState<string | null>(null);
  const [tried, setTried] = useState(false);

  const prevId = picked ?? defaultPrevious(d.periods, start)?.id ?? NONE;
  const prev = d.periods.find((p) => p.id === prevId) ?? null;
  const carry = carryOver(prev);

  const nameErr = tried && !name.trim() ? 'Chưa nhập tên kỳ' : null;
  const startErr = tried && !start ? 'Chưa chọn ngày' : null;
  const outside = editing && start ? entriesOutside(period, start, end) : 0;
  const endErr =
    start && end && end < start ? 'Trước ngày bắt đầu' : outside > 0 ? `${outside} khoản nằm ngoài khoảng ngày` : null;

  function save() {
    setTried(true);
    if (!name.trim() || !start || endErr) return;
    if (editing) {
      update((dd) => {
        const p = dd.periods.find((x) => x.id === period.id)!;
        Object.assign(p, { name: name.trim(), start, end });
      });
      onClose();
    } else {
      const p = buildPeriod({ name, start, end }, prev, d.settings);
      update((dd) => { dd.periods.push(p); });
      onCreated?.(p.id);
    }
  }

  return (
    <Sheet title={editing ? 'Sửa kỳ' : 'Tạo kỳ mới'} onClose={onClose}>
      <Field label="Tên kỳ" error={nameErr}>
        <input className={`input ${nameErr ? 'bad' : ''}`} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Field label="Ngày bắt đầu" error={startErr}>
            <DateField value={start} onChange={setStart} bad={!!startErr} />
          </Field>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Field label="Ngày kết thúc" error={endErr}>
            <DateField value={end} min={start ?? undefined} onChange={setEnd} clearable bad={!!endErr} />
          </Field>
        </div>
      </div>
      {!editing && d.periods.length > 0 && (
        <>
          <Field label="Chọn kỳ trước đó">
            <select className="input" value={prevId} onChange={(e) => setPicked(e.target.value)}>
              {sortPeriods(d.periods).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              <option value={NONE}>Không chọn</option>
            </select>
          </Field>
          {carry !== 0 && (
            <div className={`carry ${carry < 0 ? 'neg' : ''}`}>
              <span>↩️ Còn lại từ tháng trước</span><b>{signed(carry)}</b>
            </div>
          )}
        </>
      )}
      <button className="btn pri" style={{ marginTop: 12 }} onClick={save}>{editing ? 'Lưu' : 'Tạo kỳ'}</button>
      {editing && <button className="text-danger" onClick={onDelete}>Xóa kỳ</button>}
    </Sheet>
  );
}
