import { ReactNode } from 'react';
import { S3_0_Overview } from './screens/S3_0_Overview';
import { S4_0_Periods } from './screens/S4_0_Periods/S4_0_Periods';
import { S5_0_PeriodDetail } from './screens/S5_0_PeriodDetail/S5_0_PeriodDetail';
import { S6_0_Settings } from './screens/S6_0_Settings/S6_0_Settings';
import { S7_0_Savings } from './screens/S7_0_Savings/S7_0_Savings';

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
  { num: '3.0', path: '/overview', depth: 1, element: <S3_0_Overview /> },
  { num: '4.0', path: '/periods', depth: 1, element: <S4_0_Periods /> },
  { num: '5.0', path: '/periods/:id/:tab', depth: 2, element: <S5_0_PeriodDetail /> },
  { num: '6.0', path: '/settings', depth: 3, element: <S6_0_Settings /> },
  { num: '7.0', path: '/savings', depth: 1, element: <S7_0_Savings /> },
];

/** Depth of a pathname (unknown paths count as `/`) */
export function depthOf(pathname: string) {
  if (pathname.startsWith('/periods/')) return 2;
  return ROUTES.find((r) => r.path === pathname)?.depth ?? 0;
}

/** 5.0 tabs share one page: `/periods/:id/goals` → `/periods/:id`, so switching tabs is not a page transition */
export const pageKey = (pathname: string) => pathname.replace(/^(\/periods\/[^/]+)\/.*$/, '$1');
