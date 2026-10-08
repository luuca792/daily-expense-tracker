// Several tabs or windows (plan §4.5): after each save, a tab says "saved"; the others re-read the data.
const CHANNEL = 'so-chi-tieu';

let channel: BroadcastChannel | null = null;
const getChannel = () => {
  if (typeof BroadcastChannel === 'undefined') return null;
  return (channel ??= new BroadcastChannel(CHANNEL));
};

export function postSaved() {
  getChannel()?.postMessage('saved');
}

/** Calls `onSaved` when another tab has saved; returns the unsubscribe function */
export function onOtherTabSaved(onSaved: () => void) {
  const ch = getChannel();
  if (!ch) return () => undefined;
  const listener = (e: MessageEvent) => {
    if (e.data === 'saved') onSaved();
  };
  ch.addEventListener('message', listener);
  return () => ch.removeEventListener('message', listener);
}
