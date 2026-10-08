// Amounts are integers in thousands of đồng (plan §3.2): 1700 = 1.700.000 ₫.

const nf = new Intl.NumberFormat('vi-VN');
const MINUS = '−';

/** vi-VN grouping: 10.500 (D48); negative with a real minus sign */
export const money = (n: number) => (n < 0 ? MINUS : '') + nf.format(Math.abs(n));

/** Always signed: "+20.000" / "−9.500" */
export const signed = (n: number) => (n < 0 ? MINUS : '+') + nf.format(Math.abs(n));

/** An expense amount, shown with a minus: "−60" (D49) */
export const minus = (n: number) => (n < 0 ? '+' : MINUS) + nf.format(Math.abs(n));

/** Longest amount that can be typed (9 digits ≈ 999 tỷ đồng) */
export const AMOUNT_DIGITS = 9;

/**
 * Amount box input → integer: every non-digit is dropped (grouping dots, spaces, pasted "₫"),
 * cut to AMOUNT_DIGITS; empty → null. `negative` comes from the box's ± button, not from the text.
 */
export function parseAmount(text: string, negative = false): number | null {
  const digits = text.replace(/\D/g, '').slice(0, AMOUNT_DIGITS);
  if (digits === '') return null;
  const n = parseInt(digits, 10);
  return negative ? -n : n;
}
