/** 5.0 bottom bar: one button per tab, the current one highlighted */
export function BottomBar<K extends string>({ tabs, current, onSelect }: {
  tabs: readonly { key: K; icon: string; label: string }[]; current: K; onSelect: (k: K) => void;
}) {
  return (
    <nav className="tabbar fixed-col">
      {tabs.map((t) => (
        <button key={t.key} className={current === t.key ? 'on' : ''} onClick={() => onSelect(t.key)}>
          <i>{t.icon}</i>{t.label}
        </button>
      ))}
    </nav>
  );
}
