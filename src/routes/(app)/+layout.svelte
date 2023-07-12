<script>
  import Footer from "$lib/components/footer.svelte";
  import Nav from "$lib/components/nav.svelte";
  import Sidebar from "$lib/components/sidebar.svelte";
  import { theme } from "$lib/stores/theme";
</script>

<main class="rounded-tr-box bg-cover rounded-b-box drawer drawer-mobile fixed">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content bg-base-100">
    <Nav />
    <div class="bg container-fluid mx-auto pb-20 pt-5  bg-base-200 rounded-xl h-screen overflow-auto">
      <slot />
    </div>
  </div>
  <Sidebar />
</main>

<style>
  .bg {
    background-size: 5px 5px;
    background-image: radial-gradient(hsla(var(--bc) / 0.2) 0.5px, hsla(var(--b2) / 1) 0.5px);
  }
</style>
