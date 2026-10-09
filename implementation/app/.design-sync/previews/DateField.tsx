import { useState } from 'react';
import { DateField, Field } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);

export const Default = () => {
  const [d, setD] = useState('2026-10-07');
  return <Frame><Field label="Ngày"><DateField value={d} min="2026-10-01" onChange={setD} /></Field></Frame>;
};

export const Invalid = () => {
  const [d, setD] = useState('2026-09-28');
  return (
    <Frame>
      <Field label="Ngày bắt đầu" error="Phải sau ngày kết thúc của kỳ trước">
        <DateField value={d} onChange={setD} bad />
      </Field>
    </Frame>
  );
};
