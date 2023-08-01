<script lang="ts">
  import hi from "$lib/datepicker/i18n/locales/hi";
  import { configs } from "$lib/stores/configs";
  import { results, student } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import type { Record, Result } from "@prisma/client";

  export let records: Record[];
  export let resultId: string;
  export let result: Result | null = null;

  type FormInput = {
    data: FormData;
    action: URL;
    form: HTMLFormElement;
    cancel(): void;
  };

  let highest: number | undefined;
  let lowest: number | undefined;
  let totalScore: number;
  let averageScore: number;

  $: {
    const scores = records.map((record) => Number(record.score));
    if (scores) {
      totalScore = scores?.reduce((sum, score) => sum + score, 0);
      averageScore = Math.round(totalScore / scores?.length);
    }

    const allScores = $results
      .filter((result) => result.studentId != $student?.id && result.term == $configs?.term)
      .map((result) => result.records)
      .map((records) => records.map((record) => Number(record.score)));

    let averages = allScores.map((scores) =>
      Math.round(scores.reduce((a, b) => a + b, 0) / scores?.length)
    );

    averages = [...averages, averageScore];
    averages = averages.sort((a, b) => a - b);
    highest = averages.pop();
    lowest = averages.reverse().pop();

    fetch(`api/result/${resultId}`, {
      method: "POST",
      body: JSON.stringify({ lowest, highest }),
    }).then((resp) =>
      resp.json().then((body) => {
        console.log({ body });
      })
    );
  }
</script>

<table class="min-w-max w-full table-fixed mb-5 rounded print:break-inside-avoid">
  <tbody class="align-baseline">
    <tr class="border-b">
      <td
        class="print:bg-violet-900 whitespace-nowrap capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
      >
        <span> Total Score </span>
      </td>
      <td class="py-2 text-xs print:text-slate-500">{totalScore || 0}</td>
      <td
        class="print:bg-violet-900 whitespace-nowrap capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
      >
        <span> Average Score </span>
      </td>
      <td class="py-2 text-xs print:text-slate-500 px-5">{averageScore || 0}</td>
      <td
        class="print:bg-violet-900 whitespace-nowrap capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
      >
        <span> High Class Average </span>
      </td>
      <td class="py-2 text-xs print:text-slate-500 px-10">{result?.highest || 0}</td>
      <td
        class="print:bg-violet-900 whitespace-nowrap capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
      >
        <span> Low Class Average </span>
      </td>
      <td class="py-2 text-xs print:text-slate-500 px-10">{result?.lowest || 0}</td>
    </tr>
    <tr class="border-b">
      <td
        class="print:bg-violet-900 whitespace-nowrap capitalize btn btn-xs border print:text-slate-300 cursor-default rounded-full"
      >
        <span> Grading System </span>
      </td>
      <td colspan="4" class="py-2 px-5 text-xs print:text-slate-500 uppercase">
        {#if $user?.arm == "eyfs"}
          {`Emerging(0-80) Expected(81-90) Exceeding(91-100)`}
        {:else}
          {`A(94-100) B(86-93) C(77-85) D(70-76) E(0-69)`}
        {/if}
      </td>
    </tr>
  </tbody>
</table>
