<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { Header, Rating, Records, Remark, Scores } from "$lib/components/result";
  import StudentInfo from "$lib/components/result/studentInfo.svelte";

  import ReusultList from "$lib/components/reusultList.svelte";
  import StudentDetail from "$lib/components/studentDetail.svelte";
  import { configs } from "$lib/stores/configs";
  import { comments, results, student } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  
  let frame: HTMLIFrameElement;
  let resultId: string = "";
  let checked: boolean;

  let result = $results.find(
    (res) =>
      $configs.term == res.term &&
      $configs.academicYear == res.academicYear &&
      res.studentId == $student?.id
  );

  $: if (resultId) {
    result = $results.find((res) => (res.id = resultId));
  }

  const onPrint = () => {
    // goto(`/print/${$student?.id}`);
    // return;
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
    return async ({ result, update }: any) => {
      results.update((prev) => [...prev, result]);
      checked = false;
      update();
    };
  };

  onMount(async () => {
    const res = await fetch("/api/comments");
    const json = await res.json();
    comments.set(json?.comments || []);
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
        <div class="card bg-base-100 shadow-sm mb-3 w-full ">
          <div class="card-body">
            <StudentDetail />
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm mb-3 w-full ">
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
            <legend class="contents text-sm font-semibold leading-6 ">Select Term</legend>
            <!-- <p class="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p> -->
            <div class="mt-4 space-y-4">
              <div class="flex items-center">
                <input type="radio" name="term" value="first" class="radio" />
                <label for="mail" class="ml-3 block text-sm font-medium leading-6 ">
                  First Term
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" name="term" value="second" class="radio" />
                <label for="femail" class="ml-3 block text-sm font-medium leading-6 ">
                  Second Term
                </label>
              </div>
              <div class="flex items-center">
                <input type="radio" name="term" value="third" class="radio" />
                <label for="femail" class="ml-3 block text-sm font-medium leading-6 ">
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
