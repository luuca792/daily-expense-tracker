import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HOME, ROUTES } from './routes';

// Hash URLs (plan §2.1): the static server never needs to know the app's paths.
// The data guard (1.0 / 1.1 before any other page) comes with the store in §7 step 2.
export function App() {
  return (
    <HashRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={HOME} />
          {ROUTES.map((r) => (
            <Route key={r.num} path={r.path} element={r.element} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
