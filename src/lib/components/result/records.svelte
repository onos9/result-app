<script lang="ts">
  import { enhance } from "$app/forms";
  import { configs } from "$lib/stores/configs";
  import { grades, results, subjects, result } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import type { Grade, Record } from "@prisma/client";
  import { onMount } from "svelte";

  export let records: Record[];
  export let resultId: string;

  type FormInput = {
    data: FormData;
    action: URL;
    form: HTMLFormElement;
    cancel(): void;
  };

  let checked = false;
  let isEdit = false;
  let recordId: string | null;
  let grade: Grade | undefined;
  let objective: string | null | undefined;
  let errorMessage: string = "";
  let record: Record | undefined;
  let scores: number[] = [];
  let score: number;

  let colors = {
    A: "bg-purple-200",
    B: "bg-blue-200",
    C: "bg-yellow-200",
    D: "bg-orange-200",
    E: "bg-red-200",
    exceeding: "bg-purple-200",
    expected: "bg-blue-200",
    emerging: "bg-red-200",
  };

  let keys: any[] = [];
  let blacklist = ["id", "arm", "resultId", "createdAt", "updatedAt", "color"];

  onMount(() => {
    const record = records.filter((record) => record.arm == $user?.arm);
    keys = Object.entries(record[0] || {}).map(([key, value]) =>
      value && !blacklist.includes(key) ? key : null
    );

    if (keys.length) keys.push("action");
    // console.log({ $subjects });
  });

  const onSubmit = async ({ form, action, data, cancel }: FormInput) => {
    data.set("resultId", resultId);
    data.set("arm", $user?.arm as string);

    const gradePoint = data.get("grade") as string;
    const outcome = data.get("outcome") as string;
    if (gradePoint) data.set("color", colors[gradePoint as never]);
    if (outcome) data.set("color", colors[outcome.toLowerCase() as never]);

    return async ({ result, update }: any) => {
      update();
      console.log(result);
      if (result.type == "success") {
        grade = undefined;
        form.reset;
        checked = false;
      }

      if (result.data.error == "P2002" && !recordId) {
        errorMessage = `${data.get("subject")} is already recorded choose another subject`;
      }

      if (result.data.edit) {
        const index = records.findIndex((rating) => rating.id == result.data.rating.id);
        if (index === -1) return;
        records[index] = result.data.record;
        recordId = null;
        return;
      }

      if (result.data?.id) {
        const newRecords = records.filter((record) => record.id != result.data?.id);
        records = [...newRecords];
        return;
      }

      if (result.data.record) {
        records = [...records, result.data.record];
        await computScores();
      }
    };
  };

  const calculateGrade = ({ target }: Event, index: number) => {
    const input = target as HTMLInputElement;
    scores.splice(index, 1, Number(input.value));
    score = scores.reduce((a, b) => a + b, 0);
    grade = $grades.find(
      (grade) =>
        score <= Number(grade?.maxScore) &&
        score >= Number(grade?.minScore) &&
        $user?.arm == grade.arm
    );
  };

  const setObjective = ({ target }: Event) => {
    const input = target as HTMLSelectElement;
    const name = input.value;
    objective = $subjects.find((subject) => subject.name == name)?.objective;
  };

  const editRecord = (id: string) => {
    record = records.find((record) => record.id == id);
    recordId = record?.id as string;
    isEdit = true;
    checked = !checked;
  };

  const computScores = async () => {
    const scores = records.map((record) => Number(record.score));
    if (scores && $result) {
      let totalScore = String(scores?.reduce((sum, score) => sum + score, 0) || 0);
      let averageScore = String(Math.round(Number(totalScore) / scores?.length) || 0);

      const allScores = $results
        .filter((result) => result.term == $configs?.term)
        .map((result) => result.records)
        .map((records) => records.map((record) => Number(record.score)));

      let averages = allScores.map((scores) =>
        Math.round(scores.reduce((a, b) => a + b, 0) / scores?.length)
      );

      averages = averages.sort((a, b) => a - b);
      console.log(averages);
      let highest = String(averages.pop() || 0);
      let lowest = String(averages.reverse().pop() || 0);

      const resp = await fetch(`/api/result/${resultId}`, {
        method: "POST",
        body: JSON.stringify({ totalScore, averageScore, highest, lowest }),
      });
      const { result } = await resp.json();
      $result = { ...$result, ...result };
      console.log({ $result });
    }
  };
</script>

<div class="text-sm flex mb-3 print:hidden">
  <label for="modal-rec" class="btn btn-sm btn-primary cursor-pointer">
    Add Record
    <div class="i-bx:bxs-edit-alt text-lg ml-1" />
  </label>
</div>

<table class="min-w-max w-full table-auto mb-4 overflow-hidden">
  <thead>
    <tr
      class="print:bg-violet-900 bg-neutral text-neutral-content tezprimary-content uppercase print:text-slate-300 text-xs leading-normal"
    >
      {#each keys as key}
        {#if key == "subject"}
          <th class="py-1 px-6 text-left">
            {$user?.arm == "primary" ? "Subjects" : "Learning Areas"}
          </th>
        {:else if key}
          <th
            class="py-1 px-6 text-center {key != 'action' ? 'print:border-r-2' : ''} {key ==
            'action'
              ? 'print:hidden'
              : ''}"
          >
            {key.replace("_", " ")}
          </th>
        {/if}
      {/each}
    </tr>
  </thead>
  {#if records?.length}
    <tbody class="print:text-gray-600 text-sm font-light">
      {#each records as record}
        <tr class="border-b border-gray-200 hover:bg-base-300">
          <td class="py-3 px-6 text-left max-w-xs whitespace-normal print:w-24">
            {record?.subject}
          </td>

          {#if record?.objectives?.length}
            <td class="py-3 px-6 max-w-xs">
              <ul class="list-disc">
                {#each record.objectives?.split("|") as objective}
                  <li>{objective}</li>
                {/each}
              </ul>
            </td>
          {/if}
          {#if record.outcome}
            <td class="py-3 px-6 text-center">
              <span class="{record.color} text-violet-600 py-1 px-3 rounded-full text-xs">
                {record.outcome}
              </span>
            </td>
          {/if}

          {#if record.mta}
            <td class="py-3 px-6 text-center whitespace-nowrap">{record.mta}</td>
          {/if}
          {#if record.ca}
            <td class="py-3 px-6 text-center whitespace-nowrap">{record.ca}</td>
          {/if}
          {#if record.report}
            <td class="py-3 px-6 text-center whitespace-nowrap">{record.report}</td>
          {/if}
          {#if record.exam}
            <td class="py-3 px-6 text-center whitespace-nowrap">{record.exam}</td>
          {/if}
          {#if record.score}
            <td class="py-3 px-6 text-center whitespace-nowrap">{record.score}</td>
          {/if}

          {#if record.grade}
            <td class="py-3 px-6 text-center">
              <span class="{record.color} text-violet-600 py-1 px-3 rounded-full text-xs">
                {record.grade}
              </span>
            </td>
          {/if}
          <td class="py-3 px-6 flex justify-center print:hidden">
            <!-- <div class="tooltip mx-2" data-tip="Edit">
            <button on:click={() => editRecord(record.id)} class="i-bx:bxs-edit text-lg" />
          </div> -->
            <form action="?/record&id={record.id}" method="post" use:enhance={onSubmit}>
              <div class="tooltip" data-tip="Delete">
                <button class="i-bx:bxs-trash text-lg text-accent-focus" />
              </div>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  {/if}
</table>

<input bind:checked type="checkbox" id="modal-rec" class="modal-toggle" />
<div class="modal">
  <div class="modal-box md:w-3/12 w-10/12 relative">
    <label for="modal-rec" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm mb-5">Add Student Record</div>
    <div class="mt-5 md:col-span-2 md:mt-0">
      <form
        action="?/record&edit={isEdit || ''}&id={recordId || ''}"
        method="POST"
        use:enhance={onSubmit}
      >
        <div class="grid grid-cols-6 gap-4">
          <div class="relative col-span-6">
            <select
              on:change={setObjective}
              name="subject"
              id="subject"
              class="input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            >
              <option selected disabled>Choose Learning Area</option>
              {#each $subjects as subject}
                <option>{subject.name}</option>
              {/each}
            </select>
            <label for="subject" class="floating-label peer-focus:text-accent-focus">
              {$user?.arm == "prmary" ? "Subject" : "Learning Areas"}
            </label>
          </div>
          {#if $user?.arm == "primary"}
            <div class="relative col-span-6 sm:col-span-3">
              <input
                on:keyup={(e) => calculateGrade(e, 0)}
                value={record?.mta || ""}
                name="mta"
                type="text"
                id="mta"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="mta" class="floating-label peer-focus:text-accent-focus"> MTA </label>
            </div>
            <div class="relative col-span-6 sm:col-span-3">
              <input
                on:keyup={(e) => calculateGrade(e, 1)}
                name="ca"
                type="text"
                id="ca"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="ca" class="floating-label peer-focus:text-accent-focus"> CA </label>
            </div>
            <div class="relative col-span-6 sm:col-span-3">
              <input
                on:keyup={(e) => calculateGrade(e, 2)}
                name="report"
                type="text"
                id="report"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="report" class="floating-label peer-focus:text-accent-focus">
                Report
              </label>
            </div>
            <div class="relative col-span-6 sm:col-span-3">
              <input
                on:keyup={(e) => calculateGrade(e, 3)}
                name="exam"
                type="text"
                id="exam"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="exam" class="floating-label peer-focus:text-accent-focus"> Exam </label>
            </div>
            <div class="relative col-span-6 sm:col-span-3 text-center">
              <input
                value={score || "0"}
                name="score"
                readonly
                type="text"
                class="btn hover:bg-base-100 cursor-default bg-transparent border bordercursor-default rounded-full"
              />
              <span>Score</span>
            </div>
            <div class="relative col-span-6 sm:col-span-3 text-center">
              <input
                value={grade?.point || "E"}
                name="grade"
                readonly
                type="text"
                class="btn hover:bg-base-100 cursor-default bg-transparent border bordercursor-default rounded-full"
              />
              <span>Grade</span>
            </div>
          {/if}
          {#if $user?.arm == "eyfs"}
            <div class="relative col-span-6">
              <legend class="contents text-sm font-semibold leading-6 mb-3">Objectives</legend>
              <textarea
                value={objective || ""}
                readonly
                rows="4"
                name="objectives"
                id="about"
                class="textarea textarea-bordered floating-input peer focus:border-accent-focus"
              />
            </div>
            <div class="relative col-span-6 sm:col-span-3">
              <input
                on:keyup={(e) => calculateGrade(e, 0)}
                name="score"
                type="text"
                id="score"
                class="input input-bordered appearance-none floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="score" class="floating-label peer-focus:text-accent-focus"> Score </label>
            </div>

            <div class="relative col-span-6 sm:col-span-3">
              <input
                value={grade?.point || ""}
                readonly
                name="outcome"
                id="outcome"
                class="input input-bordered appearance-none floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="outcome" class="floating-label peer-focus:text-accent-focus">
                Outcome
              </label>
            </div>
          {/if}
          <legend class="col-span-6 text-sm text-error">{errorMessage}</legend>
          <div class="text-right col-span-6 sm:col-span-6">
            <button class="btn btn-sm">{recordId ? "Save" : "Add"}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
