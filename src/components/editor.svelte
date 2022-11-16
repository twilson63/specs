<script>
  import { onMount } from "svelte";
  import { EditorView, basicSetup } from "codemirror";
  import { EditorState, Compartment } from "@codemirror/state";
  import { markdown } from "@codemirror/lang-markdown";

  let language = new Compartment(),
    tabSize = new Compartment();

  let state = EditorState.create({
    extensions: [
      basicSetup,
      language.of(markdown()),
      tabSize.of(EditorState.tabSize.of(2)),
      EditorView.theme({
        ".cm-content": {
          maxWidth: "50em",
        },
        ".cm-scroller": {
          maxHeight: "75vh",
          overscrollBehavior: "none",
        },
      }),
    ],
  });

  let id = crypto.randomUUID();
  onMount(() => {
    const editor = new EditorView({
      state,
      extensions: [basicSetup, markdown()],
      parent: document.getElementById(id),
    });
  });
</script>

<div class="w-[800px] h-[400px] textarea textarea-bordered" {id} />
