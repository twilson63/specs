<script>
  import { onMount } from "svelte";

  let editor = null;

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
          action: () => {},
          className: "fa fa-cloud-upload",
          text: "Publish ",
          title: "Publish Spec",
        },
        {
          name: "cancel",
          action: () => {},
          className: "fa fa-ban",
          text: "cancel ",
          title: "Cancel Spec",
        },
      ],
    });
  });
</script>

<textarea />
