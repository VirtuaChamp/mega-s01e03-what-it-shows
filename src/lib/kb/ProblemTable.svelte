<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { causeOf, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, inProblem, type Problem } from '#lib/kb/problems';

  type Ticket = { href: string; label: string };
  let { ticket, tickets }: { ticket: number; tickets: Partial<Record<Problem, Ticket>> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const rows = $derived(
    PROBLEMS.map((problem) => {
      const rs = merged.filter((r) => inProblem(r, tenantOf(r), notes.oneDayMove, problem));
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs.length,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        channels: [...new Set(rs.map((r) => r.channel))].sort().join(', '),
        seen: rs.length ? `${days[0]} → ${days[days.length - 1]}` : '',
        mismatched: rs.filter((r) => r.meta.intakeTag !== problem).length,
        filedUnder: problem === 'one-day' ? [...new Set(rs.map((r) => causeOf(r, tenantOf(r)) ?? 'unplaced'))].join(', ') : null,
      };
    }).filter((row) => row.reports > 0),
  );
</script>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>channels</th><th>seen</th><th>intake tagged otherwise</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each rows as row (row.problem)}
      <tr class:missing={!tickets[row.problem]}>
        <td><code>{row.problem}</code>{#if row.filedUnder}<br /><small>also counted in <code>{row.filedUnder}</code></small>{/if}</td>
        <td>{row.reports}</td>
        <td>{row.tenants}</td>
        <td>{row.channels}</td>
        <td>{row.seen}</td>
        <td>{row.mismatched}</td>
        <td>
          {#if tickets[row.problem]}
            <a href={tickets[row.problem]?.href}>{tickets[row.problem]?.label}</a>
          {:else}
            no ticket
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr><td>unique</td><td>{merged.length}</td><td colspan="5">reports merged into #{ticket}; each one is in exactly one of <code>parser</code> and <code>hint</code></td></tr>
  </tfoot>
</table>

<style>
  .missing td { background: var(--warn-bg); }
  .missing td:last-child { color: var(--warn); font-weight: 600; }
  tfoot td { font-weight: 600; }
</style>
