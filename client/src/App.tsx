import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import FinderApp from "@/pages/FinderApp";
import EmbeddedFinder from "@/pages/embed";

function Router() {
  return (
    <Switch>
      <Route path="/finder">
        {() => <FinderApp />}
      </Route>
      <Route path="/embed">
        {() => <FinderApp embedded={true} />}
      </Route>
      <Route path="/">
        {() => <FinderApp />}
      </Route>
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
