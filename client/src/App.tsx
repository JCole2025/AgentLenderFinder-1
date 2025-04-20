import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import FinderApp from "@/pages/FinderApp";

function Router() {
  // Check if the embedded parameter is present in the URL
  const isEmbedded = new URLSearchParams(window.location.search).get('embedded') === 'true';
  
  return (
    <Switch>
      <Route path="/finder">
        {() => <FinderApp />}
      </Route>
      <Route path="/">
        {() => <FinderApp embedded={isEmbedded} />}
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
