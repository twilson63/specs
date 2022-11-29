<script>
  import { Route, router } from "tinro";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";

  import Home from "./pages/home.svelte";
  import Specs from "./pages/index.svelte";
  import Form from "./pages/form.svelte";
  import Show from "./pages/show.svelte";
  import About from "./pages/about.svelte";

  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/specs">
    <Specs />
  </Route>
  <Route path="/specs/new">
    <Form />
  </Route>
  <Route path="/specs/:id" let:meta>
    <Show asset={meta.params.id} />
  </Route>
  <Route path="/about">
    <About />
  </Route>
</Transition>
