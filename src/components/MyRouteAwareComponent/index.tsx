import {
  ErrorBoundary,
  lazy,
  LocationProvider,
  Route,
  Router,
} from "preact-iso";

// Synchronous
import { Home } from "./routes/Home.tsx";
import { Profiles } from "./routes/Profiles.tsx";
import { ExperimentalBadge } from "../ExperimentalBadge.js";

// Asynchronous (throws a promise)
const Profile = lazy(() =>
  import("./routes/Profile.tsx").then((cmp) => cmp.Profile)
);
const NotFound = lazy(() =>
  import("./routes/_404.tsx").then((cmp) => cmp.NotFound)
);

type AppProps = { url: string };

export const MyRouteAwareComponent = ({ url }: AppProps) => (
  <LocationProvider url={url} scope="/app">
    <ErrorBoundary>
      <ExperimentalBadge />
      <Router>
        <Home path="/app" />
        {/* Alternative dedicated route component for better TS support */}
        <Route path="/app/profiles" component={Profiles} />
        <Route
          path="/app/profiles/:id"
          component={() => <Profile blah="foo" />}
        />
        {/* `default` prop indicates a fallback route. Useful for 404 pages */}
        <NotFound default />
      </Router>
      {/* @TODO remove this css hack once FullSoak supports auto-loading it on Cloudflare Workers (like in other deployment environments) */}
      <link
        href="/components/MyRouteAwareComponent/styles.css"
        rel="stylesheet"
      />
    </ErrorBoundary>
  </LocationProvider>
);
