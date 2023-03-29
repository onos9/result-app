<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  onMount(() => {});
</script>

<div class="md:container md:mx-auto">
  <div class="overflow-x-auto">
    <table class="table table-compact w-full">
      <thead>
        <tr>
          <th />
          <!-- <th></th> -->
          <th>Name</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>Gender</th>
          <th>Arm</th>
        </tr>
      </thead>
      <tbody>
        {#each data.users as user, i}
          <tr class="hover" on:click={() => goto(`/users/${user.id}`)}>
            <th>{i + 1}</th>
            <!-- <th>
              <input type="checkbox" class="checkbox" />
            </th> -->
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td>{user.gender}</td>
            <td>{user.arm?.toUpperCase()}</td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <th />
          <th>Name</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>Gender</th>
          <th>Arm</th>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
