<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Rating, Remark, Scores, StudentInfo } from "$lib/components/result";
  import Records from "$lib/components/result/records.svelte";
  import { configs } from "$lib/stores/configs";
  import { rStudents, results, students, result, rStudent, student } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import type { Class, Student } from "@prisma/client";

  let frame: HTMLIFrameElement;
  let disabled: boolean;

  const onPrint = () => {
    // goto(`/print?id=${$student.id}&remoteId=${$rStudent?.id}`);
    // return;
    const params = `?id=${$student?.id}&remoteId=${$rStudent?.id}`;
    window.history.pushState(null, $student?.fullName as string, `${$page.url.href}${params}`);

    frame.src = `/print${params}`;
    frame.onload = () => {
      const content = frame.contentWindow;
      if (!content) return;
      content.focus();
      content.print();
      content.onafterprint = () =>
        window.history.pushState(null, $student?.fullName as string, $page.url.href);
    };
  };

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

    disabled = !(!!$result && !!$student);
  };

  const isComplete = (id: string) => {
    const result = $results.find(
      (result) =>
        result?.remoteId == id &&
        result.term == $configs.term &&
        result == $configs.academicYear &&
        result.status == "uploaded"
    );
    return result?.status;
  };

  const newResult = () => {
    return async ({ result, update }: any) => {
      await update();
      if (result.data)
        $result = $results.find((res) => res.id == result?.data?.id) as typeof $result;
    };
  };
</script>

<iframe hidden class="w-full h-screen" bind:this={frame} title="printf" />

{#if $rStudent?.id}
  <div class="flex w-full justify-end mb-3">
    <form action="?/result" method="post" use:enhance={newResult}>
      <input hidden name="academicYear" value={$configs?.academicYear} type="text" />
      <input hidden name="term" value={$configs?.term} type="text" />
      <input hidden name="classId" value={$user?.classId} type="text" />
      <input hidden name="studentId" value={$student?.id} type="text" />
      <button disabled={!(!$result && !!$student)} class="btn btn-primary ms-1">
        New Result
      </button>
    </form>

    <button on:click={onPrint} class="btn btn-primary ms-1">Preview</button>
  </div>
  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-base font-semibold leading-6">Student Information</h3>
          <p class="mt-1 text-sm">
            Your Contact and personal information are very important and should be accurate.
          </p>
        </div>
      </div>
      <div class="mt-5 md:col-span-2 md:mt-0">
        <div class="card bg-base-100 shadow-sm md:w-full w-screen mb-4">
          <div class="card-body overflow-x-auto">
            {#if $result?.id}
              <StudentInfo remote_student={$rStudent}/>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="divider" />

  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-base font-semibold leading-6">Records</h3>
          <p class="mt-1 text-sm">
            Your Contact and personal information are very important and should be accurate.
          </p>
        </div>
      </div>
      <div class="mt-5 md:col-span-2 md:mt-0">
        <div class="card bg-base-100 shadow-sm md:w-full w-screen mb-4">
          <div class="card-body overflow-x-auto">
            {#if $result?.id}
              <Records records={$result?.records} resultId={$result?.id} />
              <Scores/>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

  {#if $user?.arm == "primary"}
    <div class="divider" />
    <div class="mt-10 sm:mt-0">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <div class="px-4 sm:px-0">
            <h3 class="text-base font-semibold leading-6">Ratings</h3>
            <p class="mt-1 text-sm">
              Your Contact and personal information are very important and should be accurate.
            </p>
          </div>
        </div>
        <div class="mt-5 md:col-span-2 md:mt-0">
          <div class="card bg-base-100 shadow-sm md:w-full w-screen mb-4">
            <div class="card-body overflow-x-auto">
              {#if $result?.id}
                <Rating ratings={$result?.ratings} resultId={$result?.id} />
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class="divider" />
  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-base font-semibold leading-6">Remarks</h3>
          <p class="mt-1 text-sm">
            Your Contact and personal information are very important and should be accurate.
          </p>
        </div>
      </div>
      <div class="mt-5 md:col-span-2 md:mt-0">
        <div class="card bg-base-100 shadow-sm md:w-full w-screen mb-4">
          <div class="card-body overflow-x-auto">
            {#if $result?.id}
              <Remark remarks={$result?.remarks} resultId={$result?.id} />
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="alert md:w-8/12 m-auto my-48">
    <div class="i-bx:info-circle text-2xl" />
    <span>No student selected, click the button to select a student</span>
    <div>
      <div class="dropdown dropdown-top md:dropdown-top md:dropdown-left">
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <label for="" tabindex="0" class="btn btn-sm btn-primary rounded-btn">Select Student</label>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <ul
          class="menu flex-row dropdown-content z-[1] p-2 shadow bg-base-200 rounded-box mt-4 overflow-y-auto h-96"
        >
          {#each $rStudents as student}
            <li class="flex-row">
              <a class="" href=" " on:click={() => getStudent(student.id, student.admission_no)}>
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
                  <div class=" flex flex-col">
                    <div class="font-bold">
                      {student.full_name
                        .replace(/ +(?= )/g, "")
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}
                    </div>
                    <span class="text-sm opacity-50">{student.class_name}</span>
                    <span class="badge badge-sm badge-accent badge-outline capitalize">
                      {isComplete(student.id) ?? "Pending"}
                    </span>
                  </div>
                </div>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}
