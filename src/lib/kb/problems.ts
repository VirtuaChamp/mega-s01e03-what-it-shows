import { causeOf, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'one-day' | 'unplaced';
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'one-day', 'unplaced'];

export function inProblem(r: Report, t: Tenant | undefined, oneDayMove: readonly string[], p: Problem): boolean {
  return p === 'one-day' ? oneDayMove.includes(r.id) : (causeOf(r, t) ?? 'unplaced') === p;
}

export function countByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): Record<Problem, number> {
  return Object.fromEntries(
    PROBLEMS.map((p) => [p, reports.filter((r) => inProblem(r, tenantOf(r), oneDayMove, p)).length]),
  ) as Record<Problem, number>;
}
