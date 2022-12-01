<script>
  import { app } from "../store.js";
  import SpecItem from "../components/spec-item.svelte";
</script>

<main>
  <section class="hero min-h-screen bg-base-100 items-start">
    <div class="hero-content flex-col">
      <a href="/specs/new" class="btn btn-sm btn-outline">New Spec Document</a>
      <h1>Active Specifications</h1>
      <div class="md:w-[1000px]">
        {#await $app.list() then specs}
          {#each specs as spec}
            <SpecItem {spec} />
          {/each}
        {/await}
      </div>
    </div>
  </section>
</main>
