<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Header, Rating, Records, Remark, Scores } from "$lib/components/result";
  import StudentInfo from "$lib/components/result/studentInfo.svelte";

  import ReusultList from "$lib/components/reusultList.svelte";
  import StudentDetail from "$lib/components/studentDetail.svelte";
  import { configs } from "$lib/stores/configs";
  import { comments, rStudent, results, student } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import { onMount } from "svelte";
  import type { ActionData } from "../$types";

  let frame: HTMLIFrameElement;
  let resultId: string = "";
  let checked: boolean = false;
  let isCorrect: boolean;

  let result = $results.find(
    (res) =>
      $configs.term == res.term &&
      $configs.academicYear == res.academicYear &&
      res.studentId == $student?.id
  );

  $: if (resultId) {
    result = $results.find((res) => (res.id = resultId));
  }

  export let form: ActionData;
  $: console.log(form);

  const onPrint = () => {
    frame.src = `/print/${$student?.id}`;
    frame.onload = () => {
      const content = frame.contentWindow;
      content?.focus();
      content?.print();
    };
  };

  type FormInput = {
    data: FormData;
    form: HTMLFormElement;
    cancel(): void;
  };

  const onSubmit = async ({ form, data, cancel }: FormInput) => {
    data.set("academicYear", $configs.academicYear);
    data.set("studentId", $student?.id as string);
    data.set("classId", $student?.classId as string);
    return async ({ resp, update }: any) => {
      if (resp.type === "failure") {
        console.error(resp);
        checked = true;
        return;
      }

      if (resp.deleted) {
        const data = $results.filter((res) => res.id !== resp.deleted);
        $results = [...data];
        checked = true;
        return;
      }

      results.update((prev) => [...prev, resp.result]);
      checked = false;
      update();
    };
  };

  onMount(async () => {
    let res = await fetch("/api/comments");
    let json = await res.json();
    comments.set(json?.comments || []);

    if ($student?.remoteId === $rStudent.id) isCorrect = true;
  });
</script>

<div class="container mx-auto">
  <div class="flex flex-col">
    <div class="btn-group w-full justify-end mb-3">
      <label for="modal-result" class="btn mb-3">New Result</label>
      <button on:click={onPrint} class="btn mb-3 btn-primary">Preview</button>
    </div>

    <div class="lg:grid lg:grid-cols-4 lg:gap-6">
      <div>
        <div class="card bg-base-100 shadow-sm mb-3 w-full">
          <div class="card-body">
            <StudentDetail />
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm mb-3 w-full">
          <div class="card-body">
            <ReusultList bind:resultId />
          </div>
        </div>
      </div>

      <div class="col-span-3">
        <div class="overflow-x-auto">
          <div class="flex-col min-w-screen flex overflow-hidden rounded-md">
            <div class="font-san">
              <div class="card bg-base-100 shadow-sm w-full mb-4">
                <div class="card-body overflow-x-auto">
                  <Header />
                  <StudentInfo />
                </div>
              </div>

              {#if result?.id}
                <div class="card bg-base-100 shadow-sm w-full mb-4">
                  <div class="card-body overflow-x-auto">
                    <Records records={result?.records} resultId={result.id} />
                  </div>
                </div>

                {#if $user.arm == "primary"}
                  <div class="card bg-base-100 shadow-sm w-full mb-4">
                    <div class="card-body overflow-x-auto">
                      <Rating ratings={result?.ratings} resultId={result.id} />
                    </div>
                  </div>
                {/if}
                <div class="card bg-base-100 shadow-sm w-full mb-4">
                  <div class="card-body overflow-x-auto">
                    <Remark remarks={result?.remarks} resultId={result.id} />
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<iframe hidden class="w-full h-screen" bind:this={frame} title="printf" />

<input bind:checked type="checkbox" id="modal-result" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="modal-result" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm mb-5">Add a New Result</div>
    <div class="mt-5 md:col-span-2 md:mt-0">
      <form action="?/result" method="POST" use:enhance={onSubmit}>
        <div class="grid grid-cols-6 gap-4">
          <fieldset class="col-span-6">
            <legend class="contents text-sm font-semibold leading-6">Select Term</legend>
            <!-- <p class="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p> -->
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
          <div class="text-right col-span-6">
            <button class="btn btn-sm">Submit</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<input bind:checked={isCorrect} type="checkbox" id="modal-confirm" class="modal-toggle" />
<div class="modal">
  <form
    action="?/confirm&id={$rStudent.id}"
    method="POST"
    class="modal-box w-3/12 max-w-5xl"
    use:enhance
  >
    <p class="font-bold text-sm mb-3">Confirm Student Data</p>
    <div class="mt-5 md:col-span-2 md:mt-0">
      <p>Are the data below correct for <span class="text-primary">{$student?.fullName}</span></p>
      <div class="divider" />

      <div class="">
        <div class="avatar flex flex-col p-0 px-4 justify-center items-center">
          <div class="w-24 rounded-full ring ring-neutral ring-offset-base-100 ring-offset-2 mb-4">
            <img src="/{$student?.avatarUrl}" alt="" />
            <input hidden type="text" name="photo_url" value={$student?.avatarUrl} />
            <input hidden type="text" name="remoteId" value={$rStudent?.id} />
            <input hidden type="text" name="studentId" value={$student?.id} />
          </div>
        </div>
        <div class="grid grid-row-3 gap-4">
          <div class="relative col-span-6 sm:col-span-3">
            <input
              bind:value={$rStudent.full_name}
              name="full_name"
              type="text"
              id="full_name"
              class=" input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            />
            <label for="rate" class="floating-label peer-focus:text-accent-focus">
              Full Name
            </label>
          </div>
          <div class="relative col-span-6 sm:col-span-3">
            <input
              bind:value={$rStudent.parents.guardians_email}
              name="guardians_email"
              type="text"
              id="guardians_email"
              class=" input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            />
            <label for="guardians_email" class="floating-label peer-focus:text-accent-focus">
              Guardians Email
            </label>
          </div>
          <div class="relative col-span-6 sm:col-span-3">
            <label for="" class="label">
              <span class="label-text">Profile Photo</span>
            </label>
            <input name="student_photo" type="file" class="file-input file-input-bordered w-full" />
          </div>
        </div>
        <div class="modal-action">
          <button on:click={() => (isCorrect = !isCorrect)} class="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  </form>
</div>
