<script lang="ts">
  import { enhance } from "$app/forms";
  import { user } from "$lib/stores/user";
  import type { Objective, Subject } from "@prisma/client";
  import type { PageData } from "./$types";

  export let data: PageData;
  let checked: boolean;
  let objective: Objective;
  $: ({ objectives } = data);

  const objs =
    "Be confident to try new activities and speak in a familiar group, |Work as part of a group or class taking turns and sharing fairly |Has an understanding of what is right, wrong and why |Responds to significant experiences showing a range of feelings when appropriate. |Have a developing awareness of their own needs, feelings and are sensitive to the needs of others.";

  const getObjective = (id: string) => {
    objective = objectives.find((obj) => obj.id == id) as Objective;
    checked = true;
  };
</script>

<div class="md:container md:mx-auto">
  <div class="flex w-full justify-end mb-3">
    <label for="modal-obj" class="btn btn-primary ms-1">New Objectives</label>
  </div>
  <div class="card bg-base-100 shadow-ml mb-10 w-full">
    <div class="card-body">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Objectives</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {#each objectives as objective, i}
              <tr>
                <th>{i + 1}</th>
                <td class="uppercase">{objective.name}</td>
                <td>
                  <ul class="list-disc">
                    {#each objective.text?.split("|") || [] as obj}
                      <li>{obj}</li>
                    {/each}
                  </ul>
                </td>
                <td class="flex text-xl">
                  <div class="tooltip" data-tip="Edit">
                    <button
                      on:click={() => getObjective(objective.id)}
                      class="i-bx:edit mr-2 text-primary-focus"
                    />
                  </div>
                  <div class="tooltip" data-tip="Delete">
                    <form action="?/delete&id={objective.id}" method="post" use:enhance>
                      <button class="i-bx:bxs-trash text-accent-focus" />
                    </form>
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

<input bind:checked type="checkbox" id="modal-obj" class="modal-toggle" />
<div class="modal">
  <form action="?/objective&id={objective?.id || ''}" method="POST" class="modal-box" use:enhance>
    <label for="modal-obj" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm mb-5">Learning Objectives</div>
    <div class="mt-5 md:col-span-2 md:mt-0">
      <select required name="name" class="select select-bordered w-full mb-3">
        <option disabled selected>Objectives For</option>
        <option>PREPARATORY</option>
        <option>KINDERGARTEN</option>
        <option>GRADE K</option>
        <option>CRECH</option>
      </select>

      <div class="form-control mb-3">
        <textarea
          required
          name="text"
          placeholder="Objectives"
          class="input input-bordered input-info w-full h-24"
        />
        <label for="text" class="label">
          <span class="label-text-alt text-info">Objective should be pipe seperated </span>
        </label>
      </div>
    </div>

    <div class="modal-action">
      <button class="btn">{objective?.id ? "Update" : "Add"}</button>
    </div>
  </form>
</div>
