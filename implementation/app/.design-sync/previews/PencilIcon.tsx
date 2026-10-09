import { PencilIcon } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);

export const InIconButton = () => (
  <Frame>
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <button className="icon-btn"><PencilIcon /></button>
      <div className="hello"><b className="nm" style={{ fontSize: 20 }}>Chào Minh</b><span className="pen"><PencilIcon /></span></div>
    </div>
  </Frame>
);
