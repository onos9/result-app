<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { configs } from "$lib/stores/configs";
  import { rStudent, results, student } from "$lib/stores/data_store";

  let isNetAlert: boolean = false;
  let message: string;
  let checked: boolean;
  let resultId: string;

  if (browser) console.log({ $results, $configs });
</script>

<div class="md:container md:mx-auto">
  <div class="flex flex-col w-full">
    <div class="flex justify-end w-full">
      <label class:btn-disabled={!$student} for="modal-result" class="btn btn-primary mb-3">
        New Result
      </label>
    </div>

    <div class="card bg-base-100 shadow-xl col-span-2 md:w-full w-screen">
      <div class="card-body">
        {#if isNetAlert}
          <div class="alert alert-error shadow-lg mb-3">
            <div>
              <div class="i-bx:close" />
              <span>{message}</span>
            </div>
            <div class="flex-none">
              <!-- <button on:click={() => (isNetAlert = !isNetAlert)} class="btn btn-sm btn-circle">
              ✕
            </button> -->
            </div>
          </div>
        {/if}
        <div class="overflow-x-auto md:overflow-hidden">
          <table class="table">
            <thead>
              <tr>
                <th />
                <th class="flex items-center gap-2 uppercase">
                  <span>Document Name</span>
                </th>
                <th class="uppercase">Student Name</th>
                <th class="uppercase">Academic Year</th>
                <th class="uppercase">Status</th>
                <th class="uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {#each $results as result}
                <tr>
                  <th>
                    <label>
                      <input checked={!!result?.remoteId} type="checkbox" class="checkbox" />
                    </label>
                  </th>
                  <td>
                    <a target="_blank" href="/{result.resultUrl}">
                      <div class="flex items-center space-x-3">
                        <div class="avatar placeholder">
                          <div
                            class="bg-neutral-focus text-neutral-content mask mask-squircle w-12"
                          >
                            <div class="i-bx:bxs-file-pdf text-3xl text-accent-focus" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">
                            {`${result?.student?.fullName?.toUpperCase()}.pdf`}
                          </div>
                          <div class="text-sm opacity-50">
                            {result.createdAt.toDateString()}
                          </div>
                        </div>
                      </div>
                    </a>
                  </td>
                  <td>
                    <div>
                      <div class="font-bold">
                        {result?.student?.fullName}
                      </div>
                      <span class="badge badge-sm badge-success">
                        {result?.student?.admissionNo?.split("/")[1]}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="font-bold">{result.academicYear} </span>
                  </td>
                  <td>
                    <div>
                      <span
                        class:badge-success={result.status == "uploaded"}
                        class="badge badge-sm badge-accent badge-outline capitalize"
                      >
                        {result.status}
                      </span>
                    </div>
                  </td>
                  <td class="flex text-xl justify-center">
                    <div class="dropdown dropdown-end dropdown-left mb-3">
                      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                      <label for="" tabindex="0" class="btn btn-ghost btn-sm p-0">
                        <div class="i-bx:dots-vertical-rounded text-xl" />
                      </label>
                      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                      <ul class="menu dropdown-content z-[1] p-2 shadow bg-base-200 rounded-box">
                        <li>
                          <form action="?/upload&id={result.id}" method="post" use:enhance>
                            <a target="_blank" href="/{result.resultUrl}">View</a>
                          </form>
                          <form action="?/upload&id={result.id}" method="post" use:enhance>
                            <button>Upload</button>
                          </form>
                          <form action="?/result&id={result.id}" method="post" use:enhance>
                            <button class="btn-link text-error">Delete</button>
                          </form>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<input bind:checked type="checkbox" id="modal-result" class="modal-toggle" />
{#if checked}
  <div class="modal">
    <form
      class="modal-box"
      action="?/result&id={resultId || ''}"
      method="POST"
      use:enhance={() => {
        return async ({ update }) => {
          await update();
          checked = false;
        };
      }}
    >
      <div class="mt-5 md:col-span-2 md:mt-0">
        <label for="modal-result" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <div class="font-bold text-sm mb-5">Add a New Result</div>

        <div class="grid grid-cols-6 gap-4">
          <fieldset class="col-span-6">
            <legend class="contents text-sm font-semibold leading-6">Select Term</legend>
            <input hidden type="text" name="academicYear" value={$configs?.academicYear} />
            <input hidden type="text" name="classId" value={$student?.classId} />
            <input hidden type="text" name="studentId" value={$student?.id} />
            <!-- <input hidden type="text" name="remoteId" value={$rStudent?.id} /> -->
            <div class="mt-4 space-y-4">
              <div class="flex items-center">
                <input type="radio" name="term" value="first" class="radio" />
                <label for="mail" class="ml-3 block text-sm font-medium leading-6">
                  First Term
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" name="term" value="second" class="radio" />
                <label for="femail" class="ml-3 block text-sm font-medium leading-6">
                  Second Term
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" name="term" value="third" class="radio" />
                <label for="femail" class="ml-3 block text-sm font-medium leading-6">
                  Third Term
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn btn-sm">Submit</button>
      </div>
    </form>
  </div>
{/if}
