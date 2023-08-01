<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { configs } from "$lib/stores/configs";
  import { rStudent, results, student } from "$lib/stores/data_store";

  let isNetAlert: boolean = false;
  let message: string;
  let checked: boolean;
  let resultId: string;
  let loading: boolean = false;

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
                    <form
                      action="?/upload&id={result.id}"
                      method="post"
                      use:enhance={() => {
                        loading = true;
                        return ({ result, update }) => {
                          update();
                          if (result?.type == "success") loading = false;
                        };
                      }}
                    >
                      <button class:hidden={!result?.remoteId && resultId == result.id}>
                        {#if loading}
                          <span class="loading loading-spinner loading-sm" />
                        {:else}
                          <div class="i-bx:cloud-upload text-primary text-xl" />
                        {/if}
                      </button>
                    </form>
                    {#if !result?.remoteId}
                      <div class="tooltip" data-tip="Delete">
                        <button
                          on:click={() => {
                            checked = true;
                            resultId = result.id;
                          }}
                          class="btn-link text-error"
                        >
                          <div class="i-bx:trash text-xl" />
                        </button>
                      </div>
                    {/if}
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
      <div class="flex justify-center border">
        <p>Are yot sure you want to delete this result?</p>
      </div>

      <div class="modal-action">
        <button type="button" class="btn btn-sm">No</button>
        <button class="btn btn-sm">Yes</button>
      </div>
    </form>
  </div>
{/if}
