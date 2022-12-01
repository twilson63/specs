<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let doc = {
    title: "",
    description: "",
    topics: "",
  };

  export let id = window.crypto.randomUUID();
  export let open = false;
  export let cancel = true;
  export let bgColor = "bg-white";
  export let border = "border-4 border-[#929292]";
  const dispatch = createEventDispatcher();

  function cancelClick() {
    open = false;
  }

  function handleSubmit() {
    open = false;
    dispatch("publish", doc);
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
      <h2 class="text-2xl font-bold text-[#160042]">Publish Spec</h2>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-control">
          <label for="title" class="label">Title *</label>
          <input
            id="title"
            class="input input-bordered"
            type="text"
            placeholder="title for your spec"
            required
            bind:value={doc.title}
          />
        </div>
        <div class="form-control">
          <label for="description" class="label">Description *</label>
          <textarea
            id="description"
            class="textarea textarea-bordered"
            placeholder="description"
            required
            bind:value={doc.description}
          />
        </div>
        <div class="form-control">
          <label for="topics" class="label">Topics</label>
          <input
            id="topics"
            class="input input-bordered"
            type="text"
            placeholder="comma seperated list of topics"
            bind:value={doc.topics}
          />
        </div>
        <button
          class="mt-8 btn btn-block btn-outline bg-[#E4E6F1] text-black hover:bg-gray-400"
          >Publish</button
        >
      </form>
    </div>
  </div>
</div>
