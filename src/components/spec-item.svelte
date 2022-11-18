<script>
  export let spec = {};
</script>

<div class="flex flex-col space-y-4 p-4 shadow-xl">
  <div class="text-2xl">
    {spec.title}
  </div>
  <div class="">
    {spec.description}
  </div>
  <div class="flex space-x-2">
    <div class="flex flex-col space-y-2">
      <div>Stamps</div>
      <div>{spec.stamps}</div>
    </div>
    <div class="flex flex-col space-y-2">
      <div>Date</div>
      <div>{spec.published}</div>
    </div>
    <div class="flex flex-col space-y-2">
      <div>View</div>
      <div><i class="fa fa-view" /></div>
    </div>
  </div>
</div>
