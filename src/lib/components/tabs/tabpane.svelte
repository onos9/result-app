<script lang="ts">
  import { getContext } from "svelte";

  export let active: number;
  export let items: {
    id: string;
    title: string;
    component: ConstructorOfATypedSvelteComponent;
  }[];

  //   $: active = getContext("active");
  //   $: console.log(active);
</script>

<div class="w-full">
  {#each items as item, i}
    {#if active == i}
      <div>
        <svelte:component this={item.component} id={item.id} />
      </div>
    {/if}
  {/each}
</div>
