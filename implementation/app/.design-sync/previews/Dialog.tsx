import { Dialog } from 'so-chi-tieu-ui';

// card framing only: a phone-sized box; its transform makes the component's position:fixed anchor here, not to the viewport
const Phone = ({ children, h = 560 }: { children: React.ReactNode; h?: number }) => (
  <div style={{ width: 390, height: h, position: 'relative', transform: 'translateZ(0)', overflow: 'hidden', background: 'var(--bg)' }}>
    <style>{'html{background:#fff}'}</style>
    {children}
  </div>
);
const noop = () => {};

export const ConfirmDelete = () => (
  <Phone h={420}>
    <Dialog onClose={noop}>
      <div className="ic">🗑️</div>
      <div className="title">Xóa mục tiêu "Mua sắm"?</div>
      <div className="btn-row">
        <button className="btn" onClick={noop}>Hủy</button>
        <button className="btn danger" onClick={noop}>Xóa</button>
      </div>
    </Dialog>
  </Phone>
);

export const ConfirmTeal = () => (
  <Phone h={420}>
    <Dialog onClose={noop}>
      <div className="ic teal">📅</div>
      <div className="title">Kết thúc kỳ Tháng 10?</div>
      <div className="btn-row">
        <button className="btn" onClick={noop}>Hủy</button>
        <button className="btn pri" onClick={noop}>Kết thúc</button>
      </div>
    </Dialog>
  </Phone>
);
