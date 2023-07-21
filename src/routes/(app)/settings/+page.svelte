<script lang="ts">
  import { browser } from "$app/environment";
  import { user } from "$lib/stores/user";
  import type { ActionData, PageData } from "./$types";
  import Personal from "./personal.svelte";
  import School from "./school.svelte";

  const roles = ["SUPER_ADMIN", "ADMIN"];
  export let data: PageData;
  $: ({ classes } = data);

  export let form: ActionData;
  let loaded: boolean;
  $: if (browser && form) {
    loaded = form.success as boolean;
    console.log({ form });
  }
</script>

<Personal {classes} id={form?.user?.classId} />

<div class="divider" />
{#if roles.includes($user?.role?.name ?? "")}
  <School {loaded} />
  <div class="divider" />
{/if}

<!-- <Notification /> -->
