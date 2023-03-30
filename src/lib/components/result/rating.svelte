<script lang="ts">
  import { enhance } from "$app/forms";
  import { grades } from "$lib/stores/data_store";
  import { user } from "$lib/stores/user";
  import type { Rating } from "@prisma/client";
  import { onMount } from "svelte";

  export let ratings: Rating[];
  export let resultId: string;

  type FormInput = {
    data: FormData;
    action: URL;
    form: HTMLFormElement;
    cancel(): void;
  };

  let comments = ["Fair", "Fair", "Good", "very good", "Very Good", "Excellent", "Excellent"];

  let levels = [
    "w-0/12",
    "w-1/12",
    "w-2/12",
    "w-3/12",
    "w-4/12",
    "w-5/12",
    "w-6/12",
    "w-7/12",
    "w-8/12",
    "w-9/12",
    "w-10/12",
    "w-11/12",
  ];

  let ratingId: string;
  let checked = false;
  let errorMessage: string = "";
  let comment: string;
  let rate: string;

  const onSubmit = async ({ form, action, data, cancel }: FormInput) => {
    if (ratingId) action.searchParams.set("id", ratingId);
    data.set("resultId", resultId);
    data.set("arm", $user.arm as string);
    data.set("comment", comment);

    const range = Math.round((Number(rate) / 5) * 12);
    data.set("level", range >= 12 ? "w-full" : levels[range]);

    return async ({ result, update }: any) => {
      if (result.data?.id) {
        const newRatings = ratings.filter((record) => record.id != result.data?.id);
        ratings = [...newRatings];
        update();
        return;
      }

      if (result.type == "success") {
        // console.log(result);
        form.reset;
        checked = false;
      }

      if (result.data.error == "P2002" && !ratingId) {
        errorMessage = `${data.get("subject")} is already recorded choose another subject`;
      }

      if (result.data.rating) {
        ratings = [...ratings, result.data.rating];
      }

      update();
    };
  };

  $: comment = comments[Number(rate)];
</script>

<div class=" mb-4">
  <div class="text-sm">
    <div class="font-bold mr-1 print:text-slate-700 print:opacity-75">Student Ratings</div>
  </div>
  <div class="text-sm opacity-50 flex">
    <div class="i-mdi:account-switch text-xl mr-1" />
    Social and Personal Development
  </div>
</div>
<hr />

<div class="text-sm flex mb-3 print:hidden">
  <label for="modal-rate" class="btn btn-sm btn-primary cursor-pointer">
    Add Rating
    <div class="i-bx:bxs-edit-alt text-lg ml-1" />
  </label>
</div>

{#if ratings.length}
  <table class="min-w-max w-full table-auto mb-4 rounded">
    <tbody class="align-baseline">
      {#each ratings as rating}
        <tr class="border-b">
          <td class="text-xs print:text-slate-500 capitalize">{rating.attribute}</td>
          <td class=" p-3 text-xs print:text-slate-500 capitalize">
            <div class="bg-slate-200 relative h-[16px] w-96 rounded-2xl">
              <div
                class="bg-primary absolute top-0 left-0 flex h-full px-1 items-center justify-center rounded-2xl text-xs font-semibold text-white {rating.level}"
              >
                {(Number(rating.rate || 0) / 5) * 100}%
              </div>
            </div>
          </td>
          <td class=" text-xs print:text-slate-500 capitalize">
            <span class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs uppercase">
              {rating.comment}
            </span>
          </td>
          <td class="text-center print:hidden">
            <form action="?/rating&id={rating.id}" method="post" use:enhance={onSubmit}>
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

<input bind:checked type="checkbox" id="modal-rate" class="modal-toggle" />
<label class="modal">
  <div class="modal-box relative">
    <label for="modal-rate" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <div class="font-bold text-sm mb-5">Add Student Record</div>
    <form action="?/rating" method="POST" use:enhance={onSubmit}>
      <div class="grid grid-cols-6 gap-4">
        <div class="relative col-span-6">
          <select
            name="attribute"
            id="attribute"
            class="input input-bordered floating-input peer focus:border-accent-focus"
            placeholder=" "
          >
            <option selected disabled>Choose Learning Area</option>
            <option>Adherent and Independent</option>
            <option>Self-control and Interaction</option>
            <option>Flexibility and Creativity</option>
            <option>Meticulous</option>
            <option>Neatness</option>
            <option>Overall Progress</option>
          </select>
          <label for="attribute" class="floating-label peer-focus:text-accent-focus">
            Attribute
          </label>
        </div>
        <div class="relative col-span-6 sm:col-span-3">
          <input
            bind:value={rate}
            name="rate"
            type="text"
            id="rate"
            class=" input input-bordered floating-input peer focus:border-accent-focus"
            placeholder=" "
          />
          <label for="rate" class="floating-label peer-focus:text-accent-focus"> Rate </label>
        </div>
        <div class="relative col-span-6 sm:col-span-3">
          <input
            disabled
            bind:value={comment}
            name="comment"
            type="text"
            id="comment"
            class=" input input-bordered floating-input peer focus:border-accent-focus"
            placeholder=" "
          />
          <label for="comment" class="floating-label peer-focus:text-accent-focus"> Remark </label>
        </div>

        <legend class="col-span-6 text-sm text-error">{errorMessage}</legend>
        <div class="text-right col-span-6 sm:col-span-6">
          <button class="btn btn-sm">{ratingId ? "Save" : "Add"}</button>
        </div>
      </div>
    </form>
  </div>
</label>
