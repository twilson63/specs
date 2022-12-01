<script>
  export let spec = {};
</script>

<div class="flex space-x-8 p-8 shadow-xl">
  <div class="flex-1 flex flex-col">
    <div class="text-2xl">
      {spec.title}
    </div>
    <div class="">
      {spec.description}
    </div>
  </div>
  <div class="flex flex-col">
    <div class="">
      <a class="btn btn-outline" href="https://arweave.net/{spec.id}">View</a>
      <a class="btn btn-outline" href="/specs/{spec.assetId}/fork">Fork</a>
    </div>
  </div>

  <div class="flex space-x-2">
    <div class="flex flex-col space-y-2">
      <div class="font-bold">Stamps</div>
      <div>{spec.stamps}</div>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="font-bold">Date</div>
      <div>{spec.published}</div>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="font-bold">View</div>
      <div>X</div>
    </div>
  </div>
</div>
