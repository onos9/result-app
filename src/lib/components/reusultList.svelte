<script lang="ts">
  import { page } from "$app/stores";
  import { results, student } from "$lib/stores/data_store";
  export let resultId: string;
</script>

<table class="w-full text-left border-collapse">
  <tbody class="align-baseline">
    {#each $results.filter((result) => result.studentId == $student?.id) as result}
      <tr
        on:click={() => (resultId = result.id)}
        class="cursor-pointer hover:bg-neutral-focus border-b"
      >
        <td
          translate="no"
          class="py-2 pr-2 font-mono font-medium text-xs leading-6 whitespace-nowrap capitalize"
        >
          {`${result.term} Term`}
        </td>
        <td translate="no" class="py-2 pl-2 font-mono text-xs leading-6 whitespace-pre ">
          {result.academicYear}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
