import { useState } from 'react';
import { AmountBox, DateField, Field, Sheet } from 'so-chi-tieu-ui';

// card framing only: a phone-sized box; its transform makes the component's position:fixed anchor here, not to the viewport
const Phone = ({ children, h = 560 }: { children: React.ReactNode; h?: number }) => (
  <div style={{ width: 390, height: h, position: 'relative', transform: 'translateZ(0)', overflow: 'hidden', background: 'var(--bg)' }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const noop = () => {};

export const AddExpense = () => {
  const [v, setV] = useState<number | null>(85);
  const [d, setD] = useState('2026-10-07');
  return (
    <Phone>
      <Sheet title="Thêm chi tiêu" onClose={noop}>
        <AmountBox label="Số tiền" value={v} onChange={setV} />
        <Field label="Mô tả">
          <input className="input" defaultValue="Cơm trưa văn phòng" />
        </Field>
        <Field label="Ngày">
          <DateField value={d} min="2026-10-01" onChange={setD} />
        </Field>
        <button className="btn pri">Lưu</button>
      </Sheet>
    </Phone>
  );
};

export const EditWithDelete = () => {
  const [v, setV] = useState<number | null>(18500);
  return (
    <Phone>
      <Sheet title="Sửa thu nhập" onClose={noop}>
        <AmountBox label="Số tiền" value={v} onChange={setV} accent="green" allowNegative />
        <Field label="Mô tả">
          <input className="input" defaultValue="Lương tháng 10" />
        </Field>
        <button className="btn pri">Lưu</button>
        <button className="text-danger">Xóa</button>
      </Sheet>
    </Phone>
  );
};
