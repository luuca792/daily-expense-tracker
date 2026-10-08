import { ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HOME, NAME, ROUTES, WELCOME } from './routes';
import { useStore } from './state/store';

/** Pages other than `/` need data and a display name; otherwise back to `/` (1.0 or 1.1) */
function Guard({ children }: { children: ReactNode }) {
  const ready = useStore((s) => s.data !== null && s.data.userName !== null);
  return ready ? <>{children}</> : <Navigate to="/" replace />;
}

/** `/`: no data → 1.0 Welcome; data but no name → 1.1 Your Name (plan §2.5); else 2.0 Home */
function Root() {
  const hasData = useStore((s) => s.data !== null);
  const hasName = useStore((s) => s.data?.userName != null);
  return !hasData ? WELCOME : !hasName ? NAME : HOME;
}

// Hash URLs (plan §2.1): the static server never needs to know the app's paths.
export function App() {
  return (
    <HashRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Root />} />
          {ROUTES.map((r) => (
            <Route key={r.num} path={r.path} element={<Guard>{r.element}</Guard>} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
