import { BottomBar, PlusButton } from 'so-chi-tieu-ui';

// card framing only: a phone-sized box; its transform makes the component's position:fixed anchor here, not to the viewport
const Phone = ({ children, h = 560 }: { children: React.ReactNode; h?: number }) => (
  <div style={{ width: 390, height: h, position: 'relative', transform: 'translateZ(0)', overflow: 'hidden', background: 'var(--bg)' }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const TABS = [
  { key: 'entries', icon: '📒', label: 'Thu chi' },
  { key: 'goals', icon: '🎯', label: 'Mục tiêu' },
  { key: 'stats', icon: '📊', label: 'Thống kê' },
] as const;

export const AboveBottomBar = () => (
  <Phone h={200}>
    <PlusButton onClick={() => {}} />
    <BottomBar tabs={TABS} current="entries" onSelect={() => {}} />
  </Phone>
);
