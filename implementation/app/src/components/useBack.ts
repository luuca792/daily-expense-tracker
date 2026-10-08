import { useNavigate } from 'react-router-dom';

/**
 * Back button target: wherever the page was opened from (in-app history). Opened directly
 * (reload, link: React Router's history index is 0) → `fallback`, so back never leaves the app.
 */
export function useBack(fallback: string) {
  const nav = useNavigate();
  return () => ((window.history.state?.idx ?? 0) > 0 ? nav(-1) : nav(fallback, { replace: true }));
}
