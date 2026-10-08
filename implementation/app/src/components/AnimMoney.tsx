import { money } from '../domain/money';
import { useTween } from './motion';

/** Money that counts to its new value instead of jumping (5.0 summary card) */
export function AnimMoney({ value, fmt = money }: { value: number; fmt?: (v: number) => string }) {
  return <>{fmt(useTween(value))}</>;
}
