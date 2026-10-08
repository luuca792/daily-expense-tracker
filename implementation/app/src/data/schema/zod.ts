// zod schema of the current stored version (plan §2.1): checked on load, after migrations and on import.
import { z } from 'zod';
import { COLOR_KEYS, CURRENT_VERSION, type Data } from './current';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
/** amounts: integers in thousands of đồng (plan §3.2) */
const amount = z.number().int();
const color = z.enum(COLOR_KEYS);
const createdAt = z.number().int().nonnegative();

const goal = z.object({
  id: z.string().min(1), name: z.string(), icon: z.string(), color, target: amount.nonnegative(), done: z.boolean(),
});
const living = z.object({ max: amount.nonnegative(), icon: z.string(), color });
const expense = z.object({
  id: z.string().min(1), amount, category: z.string().nullable(), description: z.string(), date: isoDate, createdAt,
});
const income = z.object({ id: z.string().min(1), amount, description: z.string(), date: isoDate, createdAt });
const transfer = z.object({
  id: z.string().min(1), dir: z.enum(['in', 'out']), amount: amount.positive(), date: isoDate, createdAt,
});
const period = z.object({
  id: z.string().min(1), name: z.string(), start: isoDate, end: isoDate.nullable(), createdAt,
  living, goals: z.array(goal), expenses: z.array(expense), incomes: z.array(income), transfers: z.array(transfer),
});

export const dataSchema = z.object({
  schemaVersion: z.literal(CURRENT_VERSION),
  settings: z.object({ livingMax: amount.nonnegative(), largeFrom: amount.nonnegative() }),
  periods: z.array(period),
  baseSavings: amount.nullable(),
  userName: z.string().nullable(),
});

// Compile-time check that the zod schema and the stored types describe the same shape.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const _sameShape: Same<z.infer<typeof dataSchema>, Data> = true;
void _sameShape;
