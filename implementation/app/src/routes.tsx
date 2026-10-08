import { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from './components/Header';

/** Placeholder until each screen is built (plan §7 step 3) */
function Todo({ name }: { name: string }) {
  const params = useParams();
  const nav = useNavigate();
  return (
    <>
      <Header title={name} onBack={() => nav('/')} />
      <div className="page">{Object.keys(params).length > 0 && <pre>{JSON.stringify(params)}</pre>}</div>
    </>
  );
}

/** 5.0 tabs, in bottom-bar order; the slug is the last URL segment (`#/periods/:id/goals`) */
export const PERIOD_TABS = ['log', 'goals', 'stats'] as const;
export type PeriodTab = (typeof PERIOD_TABS)[number];

export interface PageRoute {
  /** Screen number from prototype/screens.md */
  num: string;
  path: string;
  element: ReactNode;
  /** Navigation depth: going deeper slides in from the right, going back from the left */
  depth: number;
}

/** One entry per page number. Sheets and dialogs live inside their page and have no route.
 *  `/` (depth 0) shows 1.0, 1.1 or 2.0 depending on the data (App.tsx). */
export const ROUTES: PageRoute[] = [
  { num: '3.0', path: '/overview', depth: 1, element: <Todo name="3.0. Tổng quan" /> },
  { num: '4.0', path: '/periods', depth: 1, element: <Todo name="4.0. Ghi chép" /> },
  { num: '5.0', path: '/periods/:id/:tab', depth: 2, element: <Todo name="5.0. Chi tiết kỳ" /> },
  { num: '6.0', path: '/settings', depth: 1, element: <Todo name="6.0. Cài đặt" /> },
  { num: '7.0', path: '/savings', depth: 1, element: <Todo name="7.0. Tiết kiệm" /> },
];

/** Depth of a pathname (unknown paths count as `/`) */
export function depthOf(pathname: string) {
  if (pathname.startsWith('/periods/')) return 2;
  return ROUTES.find((r) => r.path === pathname)?.depth ?? 0;
}

/** 5.0 tabs share one page: `/periods/:id/goals` → `/periods/:id`, so switching tabs is not a page transition */
export const pageKey = (pathname: string) => pathname.replace(/^(\/periods\/[^/]+)\/.*$/, '$1');
