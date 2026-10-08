import { ReactNode, useRef } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toast } from './components/Toast';
import { depthOf, pageKey, ROUTES } from './routes';
import { S1_0_Welcome } from './screens/S1_0_Welcome/S1_0_Welcome';
import { S1_1_YourName } from './screens/S1_0_Welcome/S1_1_YourName';
import { S2_0_Home } from './screens/S2_0_Home/S2_0_Home';
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
  return !hasData ? <S1_0_Welcome /> : !hasName ? <S1_1_YourName /> : <S2_0_Home />;
}

/** Each page change re-mounts the page with a slide: from the right when going deeper, from the left when going back */
function AnimatedRoutes() {
  const loc = useLocation();
  const key = pageKey(loc.pathname);
  const prev = useRef({ key, dir: 'fwd' });
  if (prev.current.key !== key) {
    const back = depthOf(key) < depthOf(prev.current.key);
    prev.current = { key, dir: back ? 'back' : 'fwd' };
  }
  return (
    <div key={key} className={`route route-${prev.current.dir}`}>
      <Routes location={loc}>
        <Route path="/" element={<Root />} />
        {ROUTES.map((r) => (
          <Route key={r.num} path={r.path} element={<Guard>{r.element}</Guard>} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Hash URLs (plan §2.1): the static server never needs to know the app's paths.
export function App() {
  return (
    <HashRouter>
      <div className="app">
        <AnimatedRoutes />
        <Toast />
      </div>
    </HashRouter>
  );
}
