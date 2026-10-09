import { Header, PencilIcon } from 'so-chi-tieu-ui';

// card framing only: base.css paints the app backdrop (#e2e8f0) on <html>; white it out for the card
const Frame = ({ children, w = 380, bg = '#fff' }: { children: React.ReactNode; w?: number; bg?: string }) => (
  <div style={{ width: w, padding: 12, background: bg }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const noop = () => {};

export const Root = () => (
  <Frame bg="var(--bg)"><Header title="Các kỳ" right={<button className="icon-btn">⚙️</button>} /></Frame>
);

export const WithBack = () => (
  <Frame bg="var(--bg)">
    <Header title="Tháng 10" sub={<>01/10/2026 → <i>chưa kết thúc</i></>} onBack={noop} right={<button className="icon-btn">⋯</button>} />
  </Frame>
);

export const WithEdit = () => (
  <Frame bg="var(--bg)"><Header title="Mua sắm" onBack={noop} right={<button className="icon-btn"><PencilIcon /></button>} /></Frame>
);
