<script lang="ts">
  import { enhance } from "$app/forms";
  import { user } from "$lib/stores/user";
  import type { Subject } from "@prisma/client";
  import type { PageData } from "./$types";

  export let data: PageData;
  let checked: boolean;
  let subject: Subject;
  $: ({ subjects, classes } = data);

  const objs =
    "Be confident to try new activities and speak in a familiar group, Work as part of a group or class taking turns and sharing fairly, Has an understanding of what is right, wrong and why, Responds to significant experiences showing a range of feelings when appropriate., Have a developing awareness of their own needs, feelings and are sensitive to the needs of others.";

  const getSubject = (id: string) => {
    subject = subjects.find((sub) => sub.id == id) as Subject;
    checked = true;
  };
</script>

<div class="md:container md:mx-auto">
  <div class="grid grid-cols-3 gap-6 w-full mt-10">
    <div class="col-span-2">
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
    <div>
      <div class="card w-96 bg-base-100 shadow-ml">
        <div class="card-body">
          <form action="?/create" method="POST" class="w-full" use:enhance>
            {#if $user?.arm == "eyfs"}
              <select name="classId" class="select select-bordered w-full max-w-xs mb-3">
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
              <div class="form-control mb-3">
                <textarea
                  value={""}
                  name="objective"
                  placeholder="Objectives"
                  class="input input-bordered input-info w-full h-24"
                />
                <label for="obj" class="label">
                  <span class="label-text-alt text-info">Ratings should be comma seperated </span>
                </label>
              </div>
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
            <button class="btn btn-primary btn-sm">Add</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<input bind:checked type="checkbox" id="modal-std" class="modal-toggle" />
<div class="modal">
  <form action="?/update&id={subject?.id || ''}" method="POST" class="modal-box relative">
    <label for="modal-std" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm mb-5">Update Student</div>
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
        <div class="form-control mb-3">
          <textarea
            value={""}
            name="objective"
            placeholder="Objectives"
            class="input input-bordered input-info w-full h-24"
          />
          <label for="obj" class="label">
            <span class="label-text-alt text-info">Ratings should be comma seperated </span>
          </label>
        </div>
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
      <button class="btn"> Update</button>
    </dir>
  </form>
</div>
