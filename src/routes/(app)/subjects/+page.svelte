<script lang="ts">
  import { enhance } from "$app/forms";
  import { user } from "$lib/stores/user";
  import type { Subject } from "@prisma/client";
  import type { PageData } from "./$types";
  import { browser } from "$app/environment";

  export let data: PageData;
  let checked: boolean;
  let subject: Subject;
  $: ({ subjects, objectives, classes } = data);

  const objs =
    "Be confident to try new activities and speak in a familiar group |Work as part of a group or class taking turns and sharing fairly |Has an understanding of what is right, wrong and why, Responds to significant experiences showing a range of feelings when appropriate., Have a developing awareness of their own needs, feelings and are sensitive to the needs of others.";

  const getSubject = (id: string) => {
    subject = subjects.find((sub) => sub.id == id) as Subject;
    checked = true;
  };
</script>

<div class="md:container md:mx-auto">
  <div class="flex w-full justify-end mb-3">
    <label for="modal-sub" class="btn btn-primary ms-1">New Subject</label>
  </div>
  <div class="card bg-base-100 shadow-ml mb-10 w-full">
    <div class="card-body">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              <th />
              <th>Name</th>
              {#if $user?.arm == "primary"}
                <th>Max MTA</th>
                <th>Max CA</th>
                <th>Max Report</th>
              {/if}
              {#if $user?.arm == "eyfs"}
                <th>Objectives</th>
              {/if}

              <th>Max Exam</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            {#each subjects as subject, i}
              <tr>
                <th>{i + 1}</th>
                <td>{subject.name}</td>
                {#if $user?.arm == "primary"}
                  <td>{subject.max_ca}</td>
                  <td>{subject.max_report}</td>
                  <td>{subject.max_oral_point}</td>
                {/if}
                {#if $user?.arm == "eyfs"}
                  <td>
                    <ul class=" list-disc">
                      {#each subject.objective?.split("|") || [] as obj}
                        <li>{obj}</li>
                      {/each}
                    </ul>
                  </td>
                {/if}
                <td>{subject.max_exam}</td>
                <td class="flex text-xl">
                  <div class="tooltip" data-tip="Edit">
                    <button
                      on:click={() => getSubject(subject.id)}
                      class="i-bx:edit mr-2 text-primary-focus"
                    />
                  </div>
                  <div class="tooltip" data-tip="Delete">
                    <form action="?/delete&id={subject.id}" method="post" use:enhance>
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

<input bind:checked type="checkbox" id="modal-sub" class="modal-toggle" />
<div class="modal">
  <form action="?/subject&id={subject?.id || ''}" method="POST" class="modal-box relative">
    <label for="modal-sub" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm mb-5">Learning Areas</div>
    <div class="mt-5 md:col-span-2 md:mt-0">
      {#if $user?.arm == "eyfs"}
        <select name="classId" class="select select-bordered w-full mb-3">
          <option disabled selected>Select a Class</option>
          {#each classes as cls}
            <option value={cls.id}>{cls.name}({cls.section})</option>
          {/each}
        </select>
      {/if}
      <input
        name="name"
        placeholder="Subject Name"
        class="input input-bordered input-info w-full max-w-lg mb-3"
      />
      {#if $user?.arm == "eyfs"}
        <select name="objectiveId" class="select select-bordered w-full mb-3">
          <option disabled selected>Select a Objective</option>
          {#each objectives as obj}
            <option value={obj.id}>
              <span class="uppercase">{obj.name}</span>
            </option>
          {/each}
        </select>
      {/if}

      {#if $user?.arm == "primary"}
        <input
          name="max_ca"
          placeholder="Max CA Score"
          class="input input-bordered input-info w-full max-w-lg mb-3"
        />
        <input
          name="max_report"
          placeholder="Max Report Score"
          class="input input-bordered input-info w-full max-w-lg mb-3"
        />
        <input
          name="max_oral_point"
          placeholder="Max Oral Point Score"
          class="input input-bordered input-info w-full max-w-lg mb-3"
        />
      {/if}

      <input
        name="max_exam"
        placeholder="Max Exam Score"
        class="input input-bordered input-info w-full max-w-lg mb-3"
      />
    </div>

    <dir class="modal-action">
      <button class="btn">{subject?.id ? "Update" : "Add"}</button>
    </dir>
  </form>
</div>
