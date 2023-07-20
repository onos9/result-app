<script lang="ts">
  import { browser } from "$app/environment";
  import { TabNav, TabPane } from "$lib/components/tabs";
  import { configs } from "$lib/stores/configs";
  import { rStudent, rStudents, result, results, student, students } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import type { Class, Student } from "@prisma/client";
  import type { ActionData } from "./$types";
  import ResultList from "./result_list.svelte";
  import ResulteTemplate from "./resulte_template.svelte";
  import StudentList from "./student_list.svelte";

  let active = 0;
  let isDropdown: boolean;
  let termNum = $configs.term == "first" ? 0 : $configs.term == "second" ? 1 : 2;

  export let form: ActionData;
  $: if (browser) {
    console.log({ form, $user });
  }

  let items = [
    { id: "second", title: "Students", component: StudentList },
    { id: "third", title: "Results", component: ResultList },
    { id: "result", title: "Template", component: ResulteTemplate },
  ];

  const getStudent = (remoteId: number, admin_no: string) => {
    $rStudent = $rStudents.find((std) => std.id === remoteId);
    $student = $students.find((std) => std.admissionNo?.split("/")[0] == admin_no) as Student & {
      Class: Class;
    };

    $result = $results.find(
      (res) =>
        $configs.term == res.term &&
        $configs.academicYear == res.academicYear &&
        res.studentId == $student?.id
    ) as typeof $result;

    isDropdown = true;
    console.log({ $result, $student, $rStudent, $configs });
  };

  const isComplete = (id: string) => {
    const result = $results.find(
      (result) =>
        result?.remoteId == id &&
        result.term == $configs.term &&
        result == $configs.academicYear &&
        result.status == "uploaded"
    );
    return !!result;
  };
</script>

<div class="card w-full bg-base-100 text-neutral-content mb-5">
  <div class="card-body shadow-lg p-6 pb-1">
    <div class="grid grid-cols-12 mb-4">
      {#if $user?.avatarUrl}
        <div class="avatar col-span-2">
          <div class="w-44 rounded-xl">
            <img src={`/${$user?.avatarUrl}`} alt="Avatar Tailwind CSS Component" />
          </div>
        </div>
      {:else}
        <div class="avatar col-span-2 placeholder">
          <div class="bg-neutral-focus text-neutral-content w-44 rounded-xl">
            <span class="text-3xl uppercase text-primary">
              {`${$user?.firstName?.charAt(0)}${$user?.lastName?.charAt(0)}`}
            </span>
          </div>
        </div>
      {/if}

      <div class="flex flex-col col-span-7">
        <div class="font-semibold text-xl mb-2">{`${$user?.firstName} ${$user?.lastName}`}</div>
        <div class="flex opacity-30 mb-8 text-sm font-mono">
          <span class="flex mr-3 justify-center">
            <div class="i-bx:user text-lg leading-2 mr-1 text-primary" />
            <p class="leading-2">{"Instructor"}</p>
          </span>
          <span class="flex mr-3">
            <div class="i-bx:map text-lg leading-1 mr-1 text-primary" />
            <p class="leading-1">{$user?.address || "Makurdi"}</p>
          </span>
          <span class="flex mr-3">
            <div class="i-bx:envelope text-lg leading-1 mr-1 text-primary" />
            <p class="">{$user?.email}</p>
          </span>
        </div>

        <div class="flex">
          <div class="border border-dotted border-opacity-30 mr-4 p-4">
            <span class="flex">
              <div class="i-bx:down-arrow-alt text-lg" />
              <p class="">{$rStudents.length || 0}</p>
            </span>
            <p class="opacity-30">Students</p>
          </div>
          <div class="border border-dotted border-opacity-30 mr-4 p-4">
            <span class="flex">
              <div class="i-bx:up-arrow-alt text-lg" />
              <p class="">{$results.length || 0}</p>
            </span>
            <p class="opacity-30">Total Results</p>
          </div>
          <div class="border border-dotted border-opacity-30 mr-4 p-4">
            <span class="flex">
              <div class="i-bx:down-arrow-alt text-lg" />
              <p class="">{0}</p>
            </span>
            <p class="opacity-30">Completed Results</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col col-span-3 m-4">
        <div class="flex justify-end mb-4">
          <button class="btn btn-sm btn-primary">Export</button>
        </div>

        <div class="flex flex-col my-10">
          <div class="flex justify-between">
            <span class="opacity-30">Session Progress</span>
            <span class="capitalize">{`${$configs.term} Term`}</span>
          </div>
          <progress
            class="progress progress-info h-1 bg-info bg-opacity-20"
            value={termNum}
            max="2"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <TabNav bind:active {items} />

      <div class:dropdown-close={isDropdown} class="dropdown dropdown-left mb-3">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <label for="" tabindex="0" class="btn btn-neutral rounded-btn">
          {$student?.fullName || "Select Student"}
          <div class="i-bx:bxs-chevron-down text-xl" />
        </label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul
          class="menu flex-row dropdown-content z-[1] p-2 shadow bg-base-200 rounded-box mt-4 overflow-y-auto h-96"
        >
          {#each $rStudents as student}
            <li class="w-full flex-row justify-between">
              <a
                class="w-8/12"
                href=" "
                on:click={() => getStudent(student.id, student.admission_no)}
              >
                <div class="flex items-center space-x-3">
                  {#if student?.student_photo}
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <img
                          src={`https://llacademy.ng/${student?.student_photo}`}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                  {:else}
                    <div class="avatar placeholder">
                      <div class="bg-neutral-focus text-neutral-content mask mask-squircle w-12">
                        <span class="text-xl">{student.full_name.charAt(0)}</span>
                      </div>
                    </div>
                  {/if}
                  <div class="w-8/12">
                    <div class="font-bold">{student.full_name}</div>
                    <div class="text-sm opacity-50">
                      {student.class_name}
                    </div>
                  </div>
                </div>
              </a>
              <label class="w-2/12">
                <input checked={isComplete(student.id)} type="checkbox" class="checkbox" />
              </label>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>

<TabPane bind:active {items} />
