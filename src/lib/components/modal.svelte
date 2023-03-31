<script lang="ts">
  export let isOpen: boolean = false;
</script>

<input bind:checked={isOpen} type="checkbox" id="modal-rate" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="modal-rate" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <slot />
  </div>
</div>
