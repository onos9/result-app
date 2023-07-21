<script lang="ts">
  import { enhance } from "$app/forms";
  import { Datepicker } from "$lib/datepicker";
  import { onMount } from "svelte";
  import { configs } from "$lib/stores/configs";

  export let loaded: boolean = true;

  let input: HTMLInputElement;
  type FormInput = {
    data: FormData;
    cancel(): void;
  };

  onMount(() => {
    new Datepicker(input, {
      todayBtn: true,
      clearBtn: true,
      autohide: true,
    });
  });

  const onSubmit = async ({ data, cancel }: FormInput) => {
    if ($configs) {
      data.forEach((value, key) => {
        if ($configs[key] == value) data.delete(key);
      });
    }
    loaded = false;

    return async ({ result, update }: any) => update();
  };
</script>

<div class="mt-10 sm:mt-0">
  <div class="md:grid md:grid-cols-3 md:gap-6">
    <div class="md:col-span-1">
      <div class="px-4 sm:px-0">
        <h3 class="text-base font-semibold leading-6">School Settings</h3>
        <p class="mt-1 text-sm">Use a permanent address where you can receive mail.</p>
      </div>
    </div>
    <div class="mt-5 md:col-span-2 md:mt-0 bg-base-100 shadow sm:rounded-md p-5">
      <form
        class="flex justify-end w-full"
        action="?/studentData"
        method="POST"
        use:enhance={onSubmit}
      >
        {#if loaded}
          <button class="i-bx:refresh text-3xl text-primary" />
        {:else}
          <span class="loading loading-spinner text-primary" />
        {/if}
        <span class="mx-2">Relaod student data</span>
      </form>
      <form action="?/school" method="POST" use:enhance={onSubmit}>
        <div class="py-4">
          <div class="grid grid-cols-6 gap-6">
            <div class="relative col-span-6 sm:col-span-3">
              <input
                value={$configs.schoolName || ""}
                name="schoolName"
                type="text"
                id="schoolName"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="schoolName" class="floating-label peer-focus:text-accent-focus">
                School Name
              </label>
            </div>

            <div class="relative col-span-6 sm:col-span-3">
              <input
                value={$configs.academicYear || ""}
                name="academicYear"
                type="text"
                id="academicYear"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="academicYear" class="floating-label peer-focus:text-accent-focus">
                Academic Year
              </label>
            </div>

            <div class="relative col-span-6 sm:col-span-3">
              <input
                value={$configs.schoolEmail || ""}
                name="schoolEmail"
                type="email"
                id="email"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="email" class="floating-label peer-focus:text-accent-focus">Email</label>
            </div>

            <div class="relative col-span-6 sm:col-span-3">
              <input
                value={$configs.schoolPhone || ""}
                name="schoolPhone"
                type="text"
                id="phone"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="phone" class="floating-label peer-focus:text-accent-focus">Phone</label>
            </div>

            <div class="relative col-span-6 sm:col-span-3">
              <input
                value={$configs.resumptionDate || ""}
                autocomplete="off"
                readonly
                bind:this={input}
                name="resumptionDate"
                id="date"
                class="input input-bordered floating-input peer focus:border-accent-focus appearance-none"
                placeholder=" "
              />
              <label for="date" class="floating-label peer-focus:text-accent-focus">
                Vacation Date
              </label>
            </div>
            <div class="relative col-span-6 sm:col-span-3">
              <input
                value={$configs.schoolOpened || ""}
                name="schoolOpened"
                id="schoolOpened"
                class="input input-bordered floating-input peer focus:border-accent-focus appearance-none"
                placeholder=" "
              />
              <label for="schoolOpened" class="floating-label peer-focus:text-accent-focus">
                Days School Opened
              </label>
            </div>

            <fieldset class="col-span-6">
              <legend class="contents text-sm font-semibold leading-6">Term</legend>
              <!-- <p class="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p> -->
              <div class="mt-4 space-y-4">
                <div class="flex items-center">
                  <input
                    checked={($configs.term && $configs.term == "first") || false}
                    type="radio"
                    name="term"
                    value="first"
                    class="radio"
                  />
                  <label for="mail" class="ml-3 block text-sm font-medium leading-6">
                    First Term
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    checked={($configs.term && $configs.term == "second") || false}
                    type="radio"
                    name="term"
                    value="second"
                    class="radio"
                  />
                  <label for="femail" class="ml-3 block text-sm font-medium leading-6">
                    Second Term
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    checked={($configs.term && $configs.term == "third") || false}
                    type="radio"
                    name="term"
                    value="third"
                    class="radio"
                  />
                  <label for="femail" class="ml-3 block text-sm font-medium leading-6">
                    Third Term
                  </label>
                </div>
              </div>
            </fieldset>

            <div class="relative col-span-6">
              <input
                value={$configs.rusultDesc || ""}
                name="rusultDesc"
                type="text"
                id="rusultDesc"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="rusultDesc" class="floating-label peer-focus:text-accent-focus">
                Result Description
              </label>
            </div>

            <div class="relative col-span-6">
              <input
                value={$configs.schoolAddress || ""}
                name="schoolAddress"
                type="text"
                id="schoolAddress"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="schoolAddress" class="floating-label peer-focus:text-accent-focus">
                Street address
              </label>
            </div>

            <div class="relative col-span-6 sm:col-span-6 lg:col-span-2">
              <input
                value={$configs.schoolCity || ""}
                name="schoolCity"
                type="text"
                id="city"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="city" class="floating-label peer-focus:text-accent-focus"> City </label>
            </div>

            <div class="relative col-span-6 sm:col-span-6 lg:col-span-2">
              <input
                value={$configs.schoolRegion || ""}
                name="schoolRegion"
                type="text"
                id="region"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="region" class="floating-label peer-focus:text-accent-focus">
                State / Province
              </label>
            </div>

            <div class="relative col-span-6 sm:col-span-6 lg:col-span-2">
              <input
                value={$configs.schoolZipCode || ""}
                name="schoolZipCode"
                type="text"
                id="zip"
                class=" input input-bordered floating-input peer focus:border-accent-focus"
                placeholder=" "
              />
              <label for="zip" class="floating-label peer-focus:text-accent-focus">
                ZIP / Postal code
              </label>
            </div>
          </div>

          <div class="text-right mt-4">
            <button class="btn">Save</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

<!-- Here are some additional comments for EYFS pupils based on the ability levels: 

Here are some positive comments for EYFS pupils based on their ability level:

Exceeding=High ability
Expected=Middle ability
Emerging=Low ability

comments should be more than 15 and less than 20.
All comments must have be positively influencing. -->
