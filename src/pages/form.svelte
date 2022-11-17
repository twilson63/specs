<script>
  import { onMount } from "svelte";
  import { router } from "tinro";
  import Publish from "../dialogs/publish.svelte";

  let editor = null;
  let showPublish = false;

  onMount(() => {
    editor = new EasyMDE({
      minHeight: "85vh",
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "|",
        "link",
        "table",
        "code",
        "|",
        "preview",
        "side-by-side",
        "|",
        {
          name: "publish",
          action: () => {
            showPublish = true;
          },
          className: "fa fa-cloud-upload",
          text: "Publish ",
          title: "Publish Spec",
        },
        {
          name: "cancel",
          action: () => router.goto("/specs"),
          className: "fa fa-ban",
          text: "cancel ",
          title: "Cancel Spec",
        },
      ],
    });
  });

  async function handlePublish(e) {
    const spec = { ...e.detail, content: editor.value() };
    console.log(spec);
  }
</script>

<textarea />
<Publish bind:open={showPublish} on:publish={handlePublish} />
