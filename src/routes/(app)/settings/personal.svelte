<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { user } from "$lib/stores/user";
  import type { Class } from "@prisma/client";

  export let classes: Class[] = [];
  export let id: string | null | undefined;
  const cls = $user?.class;
  if (id && $user) $user.class = classes.find((cls) => cls.id == id) as Class;

  if (browser) console.log({ classes, $user, cls });
</script>

{#if $user?.id}
  <div class="mt-10 sm:mt-0">
    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="md:col-span-1">
        <div class="px-4 sm:px-0">
          <h3 class="text-base font-semibold leading-6">Personal Information</h3>
          <p class="mt-1 text-sm">Use a permanent address where you can receive mail.</p>
        </div>
      </div>
      <div class="mt-5 md:col-span-2 md:mt-0">
        <form action="?/user&id={$user?.id}" method="POST" use:enhance>
          <div class="overflow-hidden shadow sm:rounded-md">
            <div class="bg-base-100 px-4 py-5 sm:p-6">
              <div class="grid grid-cols-6 gap-6">
                <div class="relative col-span-6 sm:col-span-3">
                  <input
                    bind:value={$user.firstName}
                    name="firstName"
                    type="text"
                    id="firstName"
                    class=" input input-bordered floating-input peer focus:border-accent-focus"
                    placeholder=" "
                  />
                  <label for="firstName" class="floating-label peer-focus:text-accent-focus"
                    >First Name</label
                  >
                </div>

                <div class="relative col-span-6 sm:col-span-3">
                  <input
                    bind:value={$user.lastName}
                    name="lastName"
                    type="text"
                    id="lastName"
                    class=" input input-bordered floating-input peer focus:border-accent-focus"
                    placeholder=" "
                  />
                  <label for="lastName" class="floating-label peer-focus:text-accent-focus">
                    Last Name
                  </label>
                </div>

                <div class="relative col-span-6 sm:col-span-3">
                  <input
                    bind:value={$user.email}
                    name="email"
                    type="text"
                    id="email"
                    class=" input input-bordered floating-input peer focus:border-accent-focus"
                    placeholder=" "
                  />
                  <label for="email" class="floating-label peer-focus:text-accent-focus">
                    Email
                  </label>
                </div>

                <div class="relative col-span-6 sm:col-span-3">
                  <input
                    bind:value={$user.phone}
                    name="phone"
                    type="text"
                    id="phone"
                    class=" input input-bordered floating-input peer focus:border-accent-focus"
                    placeholder=" "
                  />
                  <label for="phone" class="floating-label peer-focus:text-accent-focus">
                    Phone Number
                  </label>
                </div>

                <div class="relative col-span-6 sm:col-span-3">
                  <select
                    bind:value={$user.arm}
                    name="arm"
                    id="arm"
                    class="input input-bordered floating-input peer focus:border-accent-focus"
                    placeholder=" "
                  >
                    <option disabled>Choose Arm</option>
                    <option value="eyfs">EYFS</option>
                    <option value="primary">Primary</option>
                    <!-- <option value="gradek">Grade K</option>
                  <option value="creche">Creche</option> -->
                  </select>
                  <label for="arm" class="floating-label peer-focus:text-accent-focus">Arm</label>
                </div>
                {#if $user?.class && classes.length}
                  <div class="relative col-span-6 sm:col-span-3">
                    <select
                      name="classId"
                      id="classId"
                      class="input input-bordered floating-input peer focus:border-accent-focus"
                      placeholder=" "
                    >
                      <option disabled selected value={$user?.classId}>
                        {`${cls?.name}${cls?.section}` ?? "Choose Your class"}
                      </option>
                      {#each classes as cls}
                        <option value={cls.id}>{`${cls.name}(${cls.section})`}</option>
                      {/each}
                    </select>
                    <label for="arm" class="floating-label peer-focus:text-accent-focus"
                      >Class</label
                    >
                  </div>
                {/if}

                <fieldset class="col-span-6">
                  <legend class="contents text-sm font-semibold leading-6">Gender</legend>
                  <!-- <p class="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p> -->
                  <div class="mt-4 space-y-4">
                    <div class="flex items-center">
                      <input
                        value="male"
                        checked={($user?.gender && $user?.gender == "male") || false}
                        type="radio"
                        name="gender"
                        class="radio"
                      />
                      <label for="male" class="ml-3 block text-sm font-medium leading-6">Male</label
                      >
                    </div>
                    <div class="flex items-center">
                      <input
                        value="female"
                        checked={($user?.gender && $user?.gender == "female") || false}
                        type="radio"
                        name="gender"
                        class="radio"
                      />
                      <label for="female" class="ml-3 block text-sm font-medium leading-6"
                        >Female</label
                      >
                    </div>
                  </div>
                </fieldset>

                <div class="relative col-span-6">
                  <input
                    bind:value={$user.address}
                    name="address"
                    type="text"
                    id="address"
                    class=" input input-bordered floating-input peer focus:border-accent-focus"
                    placeholder=" "
                  />
                  <label for="address" class="floating-label peer-focus:text-accent-focus">
                    Street address
                  </label>
                </div>

                <div class="relative col-span-6 sm:col-span-6 lg:col-span-2">
                  <input
                    bind:value={$user.city}
                    name="city"
                    type="text"
                    id="city"
                    class=" input input-bordered floating-input peer focus:border-accent-focus"
                    placeholder=" "
                  />
                  <label for="city" class="floating-label peer-focus:text-accent-focus">
                    City
                  </label>
                </div>

                <div class="relative col-span-6 sm:col-span-6 lg:col-span-2">
                  <input
                    bind:value={$user.state}
                    name="state"
                    type="text"
                    id="state"
                    class=" input input-bordered floating-input peer focus:border-accent-focus"
                    placeholder=" "
                  />
                  <label for="state" class="floating-label peer-focus:text-accent-focus"
                    >State / Province</label
                  >
                </div>

                <div class="relative col-span-6 sm:col-span-6 lg:col-span-2">
                  <input
                    bind:value={$user.zip}
                    name="zip"
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
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
