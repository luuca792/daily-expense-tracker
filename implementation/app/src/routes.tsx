import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

/** Placeholder until each screen is built (plan §7 step 3) */
function Todo({ name }: { name: string }) {
  const params = useParams();
  return (
    <div className="page">
      <div className="hd">{name}</div>
      {Object.keys(params).length > 0 && <pre>{JSON.stringify(params)}</pre>}
    </div>
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
}

/** One entry per page number. Sheets and dialogs live inside their page and have no route.
 *  `/` shows 1.0, 1.1 or 2.0 depending on the data (decided in App). */
export const ROUTES: PageRoute[] = [
  { num: '3.0', path: '/overview', element: <Todo name="3.0. Tổng quan" /> },
  { num: '4.0', path: '/periods', element: <Todo name="4.0. Ghi chép" /> },
  { num: '5.0', path: '/periods/:id/:tab', element: <Todo name="5.0. Chi tiết kỳ" /> },
  { num: '6.0', path: '/settings', element: <Todo name="6.0. Cài đặt" /> },
  { num: '7.0', path: '/savings', element: <Todo name="7.0. Tiết kiệm" /> },
];

export const HOME = <Todo name="2.0. Trang chủ" />;
