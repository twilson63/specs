<script>
  import { app } from "../store.js";
  export let asset = "";
</script>

{#await $app.get(asset) then spec}
  <pre>
  <code>
    {JSON.stringify(spec)}
  </code>
</pre>
{/await}
