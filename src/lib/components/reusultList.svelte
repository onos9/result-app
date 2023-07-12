<script lang="ts">
  import { enhance } from "$app/forms";
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
        <td translate="no" class="py-2 pl-2 font-mono text-xs leading-6 whitespace-pre">
          {result.academicYear}
        </td>
        <td class="py-3 px-6 flex justify-center print:hidden">
          <form action="?/result&id={result.id}" method="post" use:enhance>
            <div class="tooltip" data-tip="Delete">
              <button class="i-bx:bxs-trash text-lg text-accent-focus" />
            </div>
          </form>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
