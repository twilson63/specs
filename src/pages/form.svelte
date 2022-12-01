<script>
  import { onMount } from "svelte";
  import { router } from "tinro";
  import { profile, app } from "../store.js";
  import Publish from "../dialogs/publish.svelte";
  import Config from "../dialogs/config.svelte";

  export let asset = "";

  let editor = null;
  let showPublish = false;
  let showConfig = false;
  let doc = {
    title: "",
    description: "",
    topics: [],
  };

  onMount(async () => {
    editor = new EasyMDE({
      minHeight: "85vh",
      autoFocus: true,
      spellChecker: false,
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
          name: "config",
          action: () => {
            showConfig = true;
          },
          className: "fa fa-gear",
          text: "Config ",
          title: "Config Editor",
        },
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
          text: "Cancel ",
          title: "Cancel Spec",
        },
      ],
    });

    if (asset !== "") {
      const s = await $app.get(asset);
      doc.title = s.title;
      doc.description = s.description;
      doc.topics = s.topics.join(", ");
      editor.value(s.content);
    }
  });

  async function handlePublish(e) {
    const spec = { ...e.detail, content: editor.value() };
    const result = await $app.post(spec);
    console.log(result);
    router.goto("/specs");
  }
</script>

<textarea />
<Publish {doc} bind:open={showPublish} on:publish={handlePublish} />
<Config bind:open={showConfig} />
