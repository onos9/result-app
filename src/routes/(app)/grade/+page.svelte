<script lang="ts">
  import { enhance } from "$app/forms";
  import { user } from "$lib/stores/user";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ grades } = data);
  // type FormInput = {
  //   data: FormData;
  //   action: URL;
  //   form: HTMLFormElement;
  //   cancel(): void;
  // };

  // export let data: PageData;

  let primary_grade = ["A", "B", "C", "D", "E"];
  let eyfs_grade = ["Exceeding", "Expected", "Emerging"];
  // let checked = false;
  // let isAlert = false;
  // let subjectId: string;
  // let point: string = "Select Outcome";
  // let grade: Grade | undefined;
  // let message: string;

  // $: ({ grades, subjects } = data);
  // $: grade = grades.find((grade) => grade.subjectId == subjectId && grade.point == point);

  // const objs =
  //   "Be confident to try new activities and speak in a familiar group, Work as part of a group or class taking turns and sharing fairly, Has an understanding of what is right, wrong and why, Responds to significant experiences showing a range of feelings when appropriate., Have a developing awareness of their own needs, feelings and are sensitive to the needs of others.";

  // const handleGrade = (id: string) => {
  //   checked = true;
  //   subjectId = id;
  // };

  // const onSubmit = async ({ form, action, data, cancel }: FormInput) => {
  //   action.searchParams.set("id", grade?.id as string);
  //   data.set("subjectId", subjectId);
  //   data.set("arm", $user.arm as string);

  //   return async ({ result, update }: any) => {
  //     console.log(result);

  //     if (result.type == "success") {
  //       form.reset;
  //       message = "Grading system updated successfully";
  //       isAlert = true;
  //       setTimeout(() => {
  //         isAlert = false;
  //       }, 3000);
  //     }
  //     point = "Select Outcome";
  //     update();
  //   };
  // };
</script>

<div class="md:container md:mx-auto">
  <div class="grid grid-cols-3 gap-6 w-full mt-10">
    <div class="col-span-2 ">
      <div class="card bg-base-100 shadow-ml mb-10 w-full">
        <div class="card-body">
          <div class="overflow-x-auto">
            <table class="table w-full">
              <!-- head -->
              <thead>
                <tr>
                  <th />
                  <th>Point/Outcome</th>
                  <th>Min Score</th>
                  <th>Max Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <!-- row 1 -->
                {#each grades as grade, i}
                  <tr>
                    <th>{i + 1}</th>
                    <td>{grade.point}</td>

                    <td>{grade.minScore}</td>
                    <td>{grade.maxScore}</td>

                    <td class="flex text-xl">
                      <div class="tooltip" data-tip="Edit">
                        <button class="i-bx:edit mr-2 text-primary-focus" />
                      </div>
                      <div class="tooltip" data-tip="Delete">
                        <form action="?/delete&id={grade.id}" method="post" use:enhance>
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
          <form action="?/create" method="POST" use:enhance>
            {#if $user.arm == "eyfs"}
              <select name="point" class="select select-bordered w-full mb-3">
                <option disabled selected>Select Outcome</option>
                {#each eyfs_grade as point}
                  <option>{point}</option>
                {/each}
              </select>
            {:else}
              <select name="point" class="select select-bordered w-full max-w-xs mb-3">
                <option disabled selected>Select a Grade</option>
                {#each primary_grade as point}
                  <option>{point}</option>
                {/each}
              </select>
            {/if}

            <input
              name="minScore"
              placeholder="Min Score"
              class="input input-bordered w-full max-w-lg mb-3"
            />
            <input
              name="maxScore"
              placeholder="Max Score"
              class="input input-bordered  w-full max-w-lg mb-3"
            />
            <button class="btn btn-primary btn-sm">Add</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
