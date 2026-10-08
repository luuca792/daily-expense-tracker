// R2 goals. Sinh hoạt (`living`) is the built-in goal of every period and can't be deleted (R2.2).
import { LIVING, Period } from './types';

/** R2.3: delete a goal, moving its expenses to Sinh hoạt */
export function deleteGoal(p: Period, goalId: string) {
  p.goals = p.goals.filter((g) => g.id !== goalId);
  for (const e of p.expenses) if (e.category === goalId) e.category = LIVING;
}
