<script lang="ts">
  import Breadcrumb from "$lib/components/breadcrumb.svelte";
  import Graph from "$lib/components/graph.svelte";
  import Profile from "$lib/components/profile.svelte";
  import Stats from "$lib/components/stats.svelte";
  import UserTable from "$lib/components/userTable.svelte";
  import { onMount } from "svelte";

  onMount(() => {});
</script>

<div>
  <Breadcrumb title="Dashboard" route="Dashboard"/>
</div>

<div class="md:grid md:grid-rows-4 md:gap-4 lg:grid lg:grid-cols-4 lg:gap-4">
  <div class="mb-3 ">
    <Profile />
  </div>

  <div class="lg:col-span-3">
    <div class="flex flex-col lg:flex lg:flex-row">
      <Stats />
    </div>
    <div class="flex flex-col mb-3">
      <Graph />
    </div>
    <div class="flex flex-col">
      <UserTable />
    </div>
  </div>
</div>

<!-- {#if $auth.isFetching}
  <Dashboard />
{/if} -->
