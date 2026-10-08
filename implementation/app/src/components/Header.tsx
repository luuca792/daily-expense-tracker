import { ReactNode } from 'react';

/** Page header. With onBack, the whole arrow + title is the back button. */
export function Header({ title, sub, onBack, right }: {
  title: ReactNode; sub?: ReactNode; onBack?: () => void; right?: ReactNode;
}) {
  const text = <span>{title}{sub && <span className="hd-sub">{sub}</span>}</span>;
  return (
    <div className="hd">
      {onBack ? (
        <button className="title tap" onClick={onBack} aria-label="Quay lại">
          <span className="back" aria-hidden>‹</span>
          {text}
        </button>
      ) : (
        <div className="title">{text}</div>
      )}
      {right}
    </div>
  );
}
