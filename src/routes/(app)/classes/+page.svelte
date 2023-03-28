<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Class } from "@prisma/client";

  export let data: any;
  let classes: Class[];
  $: classes = data.classes;
</script>

<div class="md:container md:mx-auto">
  <div class="grid grid-cols-3 gap-6 w-full mt-10">
    <div class="card bg-base-100 shadow-ml col-span-2 mb-10 w-full">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Section</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {#each classes as cls, i}
                <tr>
                  <th>{i + 1}</th>
                  <td>{cls.name}</td>
                  <td>{cls.section}</td>
                  <td class="flex text-xl">
                    <div class="tooltip" data-tip="Edit">
                      <button class="i-bx:edit mr-2 text-primary-focus" />
                    </div>
                    <form action="?/delete&id={cls.id}" method="POST" class="w-full" use:enhance>
                      <div class="tooltip" data-tip="Delete">
                        <button class="i-bx:bxs-trash text-error" />
                      </div>
                    </form>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div>
      <div class="card w-96 bg-base-100 shadow-ml">
        <div class="card-body">
          <form action="?/create" method="POST" class="w-full" use:enhance>
            <input
              type="text"
              name="name"
              placeholder="Class Name"
              class="input input-bordered input-info w-full max-w-lg mb-3"
            />
            <input
              type="text"
              name="section"
              placeholder="Section"
              class="input input-bordered input-info w-full max-w-lg mb-3"
            />
            <button class="btn btn-primary btn-sm">Add</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
