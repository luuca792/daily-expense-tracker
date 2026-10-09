import { Field } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);

export const TextInput = () => (
  <Frame><Field label="Tên mục tiêu"><input className="input" defaultValue="Du lịch Đà Lạt" /></Field></Frame>
);

export const WithError = () => (
  <Frame><Field label="Tên mục tiêu" error="Tên này đã có"><input className="input bad" defaultValue="Mua sắm" /></Field></Frame>
);

export const ReadOnly = () => (
  <Frame><Field label="Kỳ"><div className="input ro">Tháng 10</div></Field></Frame>
);

export const Select = () => (
  <Frame>
    <Field label="Danh mục">
      <select className="input" defaultValue="g1">
        <option value="living">Sinh hoạt</option>
        <option value="g1">Đi lại</option>
      </select>
    </Field>
  </Frame>
);
