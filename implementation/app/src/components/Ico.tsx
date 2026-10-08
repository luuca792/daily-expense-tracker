import type { ColorKey } from '../domain/types';
import { PALETTE } from './palette';

/** Category icon tile. color null = untracked (dashed "?").
 *  strong: tinted with the solid color at ~33% alpha instead of the pale bg (5.2 goal list) */
export function Ico({ icon, color, size = 'sm', strong }: {
  icon: string; color: ColorKey | null; size?: 'sm' | 'md' | 'lg'; strong?: boolean;
}) {
  if (color === null) return <i className={`ico ${size} none`}>?</i>;
  return <i className={`ico ${size}`} style={{ background: strong ? PALETTE[color].solid + '55' : PALETTE[color].bg }}>{icon}</i>;
}
