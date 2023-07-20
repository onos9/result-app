<script lang="ts">
  import { user } from "$lib/stores/user";
  import type { PageData } from "./$types";
  import Personal from "./personal.svelte";
  import School from "./school.svelte";

  const roles = ["SUPER_ADMIN", "ADMIN"];
  export let data: PageData;
  $: ({ classes } = data);
</script>

<Personal {classes}/>

<div class="divider" />
{#if roles.includes($user?.role?.name ?? "")}
  <School />
  <div class="divider" />
{/if}

<!-- <Notification /> -->
