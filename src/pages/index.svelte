<script>
  import SpecItem from "../components/spec-item.svelte";

  function specs() {
    return Promise.resolve([]);
  }
</script>

<main>
  <section class="hero min-h-screen bg-base-100 items-start">
    <div class="hero-content flex-col">
      <a href="/specs/new" class="btn btn-sm btn-outline">New Spec Document</a>
      <h1>Active Specifications</h1>
      {#await specs() then specs}
        {#each specs as spec}
          <SpecItem {spec} />
        {/each}
      {/await}
    </div>
  </section>
</main>
