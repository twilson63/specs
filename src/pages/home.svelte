<script>
  import { router } from "tinro";
  import Connect from "../dialogs/connect.svelte";
  import Help from "../dialogs/connect-help.svelte";

  let showConnect = false;
  let showHelp = false;
</script>

<main>
  <section class="hero min-h-screen bg-base-100 items-start">
    <div class="hero-content flex-col">
      <h1 class="text-8xl font-bold">Specs</h1>
      <p>Permaweb Specification App</p>
      <button class="btn" on:click={() => (showConnect = true)}>Connect</button>
    </div>
  </section>
</main>
<Connect
  bind:open={showConnect}
  on:connected={() => router.goto("/specs")}
  on:help={() => (showHelp = true)}
/>
<Help bind:open={showHelp} />
