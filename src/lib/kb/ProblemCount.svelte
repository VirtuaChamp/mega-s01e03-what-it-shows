<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { countByProblem, type Problem } from '#lib/kb/problems';

  let { ticket, problem }: { ticket: number; problem?: Problem } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const counts = $derived(countByProblem(merged, tenantOf, notes.oneDayMove));
</script>

<strong>{problem ? counts[problem] : merged.length}</strong>
