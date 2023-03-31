<script lang="ts">
  import { enhance } from "$app/forms";
  import { comments, student } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import type { Comment, Remark } from "@prisma/client";
  import { onMount } from "svelte";
  const tags = [
    "speaking",
    "reading",
    "writing",
    "participation",
    "effort",
    "comprehension",
    "attention",
    "behavior",
    "pronunciation",
    "introduction",
    "conclusion",
    "vocabulary",
    "fluency",
    "directions",
    "assignments",
    "raise hand",
    "focus",
    "energy",
    "hand",
    "raises hand",
  ];

  export let remarks: Remark[];
  export let resultId: string;

  type FormInput = {
    data: FormData;
    action: URL;
    form: HTMLFormElement;
    cancel(): void;
  };

  let remarkId: string;
  let checked = false;
  let isEdit = false;
  let isAlert: boolean = false;
  let message: string;
  let errorMessage: string = "";
  let searchTerm: string;
  let commentType: string;
  let commentText: string;
  let commentFor: string = "Class Teacher's Comment";
  let filtered: Comment[] = $comments.filter((comment) => comment.type == "positive");
  let commentList: Comment[] = filtered.slice(0, 5);

  const onSubmit = async ({ form, action, data, cancel }: FormInput) => {
    if (!data.get("name") && !action.searchParams.get("id")) {
      message = "Error: Remark For is not selected, Choose whom this remark is for";
      isAlert = true;
      setTimeout(() => (isAlert = false), 5000);
      cancel();
    }

    data.set("resultId", resultId);
    data.set("arm", $user.arm as string);

    return async ({ result, update }: any) => {
      isEdit = false;
      if (result.data?.id) {
        const newRemarks = remarks.filter((record) => record.id != result.data?.id);
        remarks = [...newRemarks];
        update();
        return;
      }

      if (result.type == "success") {
        // console.log(result);
        form.reset;
        checked = false;
      }

      if (result.data.error == "P2002" && !remarkId) {
        errorMessage = `${data.get("subject")} is already recorded choose another subject`;
      }

      if (result.data.edit) {
        const index = remarks.findIndex((remark) => remark.id == result.data.remark.id);
        if (index == -1) return;
        let newRemarks = remarks;
        newRemarks[index] = result.data.remark;
        remarks = [...newRemarks];
        update();
        return;
      }

      if (result.data.remark) {
        remarks = [...remarks, result.data.remark];
      }

      console.log(remarks);
      update();
    };
  };

  $: if (commentType) {
    filtered = $comments.filter((comment) => comment.type == commentType.toLowerCase());
    searchComment();
  }

  const searchComment = () => {
    let list = filtered;
    let start: number;

    if (tags.includes(searchTerm))
      list = filtered.filter((comment) => comment.tags.includes(searchTerm));

    start = Math.floor(Math.random() * (list.length - 6));
    commentList = list.slice(start, start + 5);
  };

  const setComment = (text: string) => {
    text = text.replace(/STUDENT_NAME/g, $student?.fullName as string);
    if ($student?.gender == "male") {
      text = text
        .replace(/\bhis\/hers\b|\bhis\/her\b/g, "his")
        .replace(/\bHis\/Hers\b|\bHis\/Her\b/g, "His")
        .replace(/\bhim\/her\b/g, "him")
        .replace(/\bHim\/Her\b/g, "Him")
        .replace(/\bshe\b/g, "he")
        .replace(/\bher\b/g, "him")
        .replace(/\bhers\b|\bher\b/g, "his")
        .replace(/\bherself\b/g, "himself")
        .replace(/\bgirl\b/g, "boy")
        .replace(/\bShe\b/g, "He")
        .replace(/\bHer\b/g, "Him")
        .replace(/\bHers\b|\bHer\b/g, "His")
        .replace(/\bHerself\b/g, "Himself")
        .replace(/\bGirl\b/g, "Boy");

      // his is more common than him by 3:1
    } else if ($student?.gender == "female") {
      text = text
        .replace(/\bhis\/hers\b/g, "hers")
        .replace(/\bhim\/her\b|\bhis\/her\b/g, "her")
        .replace(/\bHim\/Her\b|\bHis\/Her\b/g, "Her")
        .replace(/\bHis\/Hers\b/g, "Hers")
        .replace(/\bhe\b/g, "she")
        .replace(/\bhis\b|\bhim\b/g, "her")
        .replace(/\bhis\b/g, "hers")
        .replace(/\bhimself\b/g, "herself")
        .replace(/\bboy\b/g, "girl")
        .replace(/\bHe\b/g, "She")
        .replace(/\bHis\b|\bHim\b/g, "Her")
        .replace(/\bHis\b/g, "Hers")
        .replace(/\bHimself\b/g, "Herself")
        .replace(/\bBoy\b/g, "Girl");
    } else {
      commentText = text;
      return;
    }

    commentText = text;
  };

  const editRemark = (id: string) => {
    const remark = remarks.find((remark) => remark.id == id);
    commentText = remark?.comment as string;
    commentFor = remark?.name as string;
    remarkId = remark?.id as string;
    isEdit = true;
    checked = !checked;
  };
</script>

<div class="text-sm flex mb-3 print:hidden">
  <label for="modal-remark" class="btn btn-sm btn-primary cursor-pointer">
    Add Remark
    <div class="i-bx:bxs-edit-alt text-lg ml-1" />
  </label>
</div>

{#if remarks}
  <table class="min-w-max w-full table-auto mb-5 rounded">
    <tbody class="align-baseline">
      {#each remarks as remark}
        <tr class="border-b print:border-b">
          <td class="py-3 px-0">
            <span
              class="print:print:bg-violet-900 print:text-slate-300 capitalize btn btn-xs border rounded-full"
            >
              {remark.name}
            </span>
          </td>
          <td class="max-w-xl text-xs text-left py-2 print:text-slate-500">
            {remark.comment}
          </td>
          <td class="text-center flex print:hidden">
            <div class="tooltip mx-2" data-tip="Edit">
              <button on:click={() => editRemark(remark.id)} class="i-bx:bxs-edit text-lg" />
            </div>
            <form action="?/remark&id={remark.id}" method="post" use:enhance={onSubmit}>
              <div class="tooltip" data-tip="Delete">
                <button class="i-bx:bxs-trash text-lg text-accent-focus" />
              </div>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<input bind:checked type="checkbox" id="modal-remark" class="modal-toggle" />
<div class="modal">
  <div class="modal-box w-11/12 max-w-5xl relative overflow-hidden">
    <label for="modal-remark" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm">Add Student Record</div>
    <div class="flex w-full overflow-hidden p-5">
      <div class="grid flex-grow w-full">
        <div class="grid grid-cols-6 gap-4">
          <div class="relative col-span-6 sm:col-span-3">
            <select
              bind:value={commentType}
              name="type"
              id="type"
              class="input input-bordered floating-input peer focus:border-accent-focus"
            >
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
              <option>Unrated</option>
            </select>
            <label for="type" class="floating-label peer-focus:text-accent-focus">
              Comment Type
            </label>
          </div>

          <div class="relative col-span-6 sm:col-span-3">
            <select
              bind:value={searchTerm}
              on:change={searchComment}
              name="type"
              id="type"
              class="input input-bordered floating-input peer focus:border-accent-focus"
              placeholder=" "
            >
              <option disabled selected>Choose a seach term</option>
              {#each tags as tag}
                <option>{tag}</option>
              {/each}
            </select>
            <label for="type" class="floating-label peer-focus:text-accent-focus">
              Search By
            </label>
          </div>
          <div class="col-span-6 text-right">
            <button on:click={searchComment} class=" btn btn-sm btn-circle">
              <div class="i-bx:refresh text-2xl" />
            </button>
          </div>
          <div class="col-span-6">
            <ul class="overflow-scroll h-72 border border-neutral rounded-lg p-3">
              {#each commentList as comment}
                <li
                  on:click={() => setComment(comment.text)}
                  on:keydown={() => {}}
                  class="py-2 pr-2 font-mono font-medium text-xs leading-6 p-3 bg-base-300 mb-2 rounded-lg hover:bg-neutral-focus"
                >
                  {comment.text}
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal" />
      <div class="w-full my-auto">
        {#if isAlert}
          <div class="alert alert-error shadow-lg mb-3">
            <div>
              <div class="i-bx:close" />
              <span>{message}</span>
            </div>
          </div>
        {/if}
        <form
          action="?/remark&edit={isEdit || ''}&id={remarkId || ''}"
          method="POST"
          use:enhance={onSubmit}
        >
          <div class="grid grid-cols-6 gap-4 justify-center items-center">
            <fieldset class="col-span-6 ">
              <legend class="contents text-sm font-semibold leading-6">Remark for</legend>
              <div class="mt-3 space-y-4 mb-4">
                <div class="flex items-center">
                  <input
                    checked={commentFor == "Class Teacher's Comment"}
                    type="radio"
                    name="name"
                    value="Class Teacher's Comment"
                    class="radio"
                  />
                  <label for="teach-comment" class="ml-3 block text-sm font-medium leading-6">
                    Class Teacher
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    checked={commentFor == "Head Teacher's Comment"}
                    type="radio"
                    name="name"
                    value="Head Teacher's Comment"
                    class="radio"
                  />
                  <label for="hm-comment" class="ml-3 block text-sm font-medium leading-6">
                    Head Teacher
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    checked={commentFor == "Recomendation"}
                    type="radio"
                    name="name"
                    value="Recomendation"
                    class="radio"
                  />
                  <label for="recomend-comment" class="ml-3 block text-sm font-medium leading-6 ">
                    Recommendation
                  </label>
                </div>
              </div>
            </fieldset>
            <div class="relative col-span-6">
              <textarea
                bind:value={commentText}
                name="comment"
                id="comment"
                class="textarea textarea-bordered w-full h-24"
                placeholder=" "
              />
              <label for="classTeacher" class="floating-label peer-focus:text-accent-focus">
                Remark
              </label>
            </div>
            <legend class="col-span-6 text-sm text-error">{errorMessage}</legend>
            <div class="text-right col-span-6">
              <button class="btn btn-sm">{remarkId ? "Save" : "Add"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
