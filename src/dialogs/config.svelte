<script>
  import { createEventDispatcher } from "svelte";

  export let id = window.crypto.randomUUID();
  export let open = false;
  export let cancel = true;
  export let bgColor = "bg-white";
  export let border = "border-4 border-[#929292]";
  let config = {
    splitView: false,
  };
  const dispatch = createEventDispatcher();

  function cancelClick() {
    open = false;
  }

  function handleSubmit() {
    open = false;
    dispatch("config", config);
  }
</script>

<input type="checkbox" {id} bind:checked={open} class="modal-toggle" />
<div class="modal">
  <div class="modal-box  {bgColor} {border}">
    {#if cancel}
      <button
        on:click={cancelClick}
        class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
      >
    {/if}
    <div class="px-[36px] py-[24px] flex flex-col space-y-8">
      <h2 class="text-2xl font-bold text-[#160042]">Config Editor</h2>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-control flex-row items-center">
          <label for="split-view" class="label flex-1">Split View</label>
          <input
            type="checkbox"
            id="split-view"
            class="toggle"
            bind:checked={config.splitView}
          />
        </div>

        <button
          class="mt-8 btn btn-block btn-outline bg-[#E4E6F1] text-black hover:bg-gray-400"
          >Save Preferences</button
        >
      </form>
    </div>
  </div>
</div>
