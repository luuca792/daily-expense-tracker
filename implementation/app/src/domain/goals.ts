// R2 goals. Sinh hoạt (`living`) is the built-in goal of every period and can't be deleted (R2.2).
import { newId } from './ids';
import { ColorKey, Data, LIVING, Period } from './types';

/** R2.3: delete a goal, moving its expenses to Sinh hoạt */
export function deleteGoal(p: Period, goalId: string) {
  p.goals = p.goals.filter((g) => g.id !== goalId);
  for (const e of p.expenses) if (e.category === goalId) e.category = LIVING;
}

/** Name, icon and color of an expense's category; null = untracked, including a goal that no longer exists (R3) */
export function categoryDisplay(p: Period, category: string | null): { name: string; icon: string; color: ColorKey } | null {
  if (category === null) return null;
  if (category === LIVING) return { name: 'Sinh hoạt', icon: p.living.icon, color: p.living.color };
  const g = p.goals.find((x) => x.id === category);
  return g ? { name: g.name, icon: g.icon, color: g.color } : null;
}

// ---------- changes (store recipes); a missing period or goal (deleted in another tab) changes nothing ----------

export interface GoalInput { name: string; icon: string; color: ColorKey; target: number }

/** 5.6 save. New goals go at the end and are not done (R2.4); changes apply to this period only (R2.1).
 *  `toggleDone` flips Hoàn thành / Mở lại (R2.5). Returns the goal id, or null. */
export function saveGoal(d: Data, periodId: string, input: GoalInput, id?: string, toggleDone = false): string | null {
  const p = d.periods.find((x) => x.id === periodId);
  if (!p) return null;
  const fields = { ...input, name: input.name.trim() };
  if (id === undefined) {
    const g = { id: newId(), ...fields, done: false };
    p.goals.push(g);
    return g.id;
  }
  const g = p.goals.find((x) => x.id === id);
  if (!g) return null;
  Object.assign(g, fields, toggleDone ? { done: !g.done } : {});
  return g.id;
}

/** 5.6 in Sinh hoạt mode (D47): icon, color and maximum; the name can't change */
export function saveLiving(d: Data, periodId: string, input: { icon: string; color: ColorKey; max: number }) {
  const p = d.periods.find((x) => x.id === periodId);
  if (p) Object.assign(p.living, input);
}

/** 5.7 */
export function removeGoal(d: Data, periodId: string, goalId: string) {
  const p = d.periods.find((x) => x.id === periodId);
  if (p) deleteGoal(p, goalId);
}
