import { causeOf, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'one-day' | 'unplaced';
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'one-day', 'unplaced'];

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  return oneDayMove.includes(r.id) ? 'one-day' : causeOf(r, t) ?? 'unplaced';
}

export function countByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): Record<Problem, number> {
  return reports.reduce<Record<Problem, number>>(
    (n, r) => {
      const p = problemOf(r, tenantOf(r), oneDayMove);
      return { ...n, [p]: n[p] + 1 };
    },
    { parser: 0, hint: 0, 'one-day': 0, unplaced: 0 },
  );
}
