<script>
  import { user } from "$lib/stores/user";
  import { onMount } from "svelte";
  import Notification from "./notification.svelte";
  import Personal from "./personal.svelte";
  import Profile from "./profile.svelte";
  import School from "./school.svelte";

const roles = ["SUPER_ADMIN", "ADMIN"]
</script>

<Personal />

<div class="divider" />
{#if roles.includes($user.role.name)}
  <School />
  <div class="divider" />
{/if}



<!-- <Notification /> -->
