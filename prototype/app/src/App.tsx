import { ReactNode, useRef } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toast } from './components/ui';
import { S1_0_Welcome } from './screens/S1_0_Welcome';
import { S2_0_Home } from './screens/S2_0_Home';
import { S3_0_Overview } from './screens/S3_0_Overview';
import { S4_0_Periods } from './screens/S4_0_Periods';
import { S5_0_PeriodDetail } from './screens/S5_0_PeriodDetail';
import { S6_0_Settings } from './screens/S6_0_Settings';
import { S7_0_Savings } from './screens/S7_0_Savings';
import { useStore } from './store/store';

function Guard({ children }: { children: ReactNode }) {
  const hasData = useStore((s) => s.data !== null);
  return hasData ? <>{children}</> : <Navigate to="/" replace />;
}

/** Screen depth: going deeper slides in from the right, going back from the left */
const depth = (path: string) =>
  path === '/' ? 0 : path.startsWith('/p/') ? 2 : path === '/settings' ? 3 : 1;

function AnimatedRoutes() {
  const hasData = useStore((s) => s.data !== null);
  const loc = useLocation();
  // 5.0 tabs share one page: switching tabs is not a page transition
  const key = loc.pathname.replace(/^(\/p\/[^/]+)\/.*$/, '$1');
  const prev = useRef({ key, dir: 'fwd' });
  if (prev.current.key !== key) {
    const back = depth(key) < depth(prev.current.key);
    prev.current = { key, dir: back ? 'back' : 'fwd' };
  }
  return (
    <div key={key} className={`route route-${prev.current.dir}`}>
      <Routes location={loc}>
          <Route path="/" element={hasData ? <S2_0_Home /> : <S1_0_Welcome />} />
          <Route path="/overview" element={<Guard><S3_0_Overview /></Guard>} />
          <Route path="/periods" element={<Guard><S4_0_Periods /></Guard>} />
          <Route path="/p/:id/:tab" element={<Guard><S5_0_PeriodDetail /></Guard>} />
          <Route path="/settings" element={<Guard><S6_0_Settings /></Guard>} />
          <Route path="/savings" element={<Guard><S7_0_Savings /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

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
