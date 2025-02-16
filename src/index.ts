/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import {
  _unstable_useFetchMode,
  Context,
  Controller,
  Get,
  setupDefaultFullsoakLogger,
  ssr,
} from "@fullsoak/fullsoak";
import { MyComponent } from "./components/MyComponent/index.tsx";
import { MyRouteAwareComponent } from "./components/MyRouteAwareComponent/index.tsx";

setupDefaultFullsoakLogger();

@Controller()
class MyController {
  @Get("/")
  renderDynamicallyImportedComponent() {
    return ssr(MyComponent, { foo: "bar" });
  }

  @Get("/app")
  @Get("/app/:page")
  @Get("/app/:page/:sup1")
  renderMyRouteAwareComponent(ctx: Context) {
    return ssr(MyRouteAwareComponent, { url: ctx.request.url.href });
  }
}

const app = _unstable_useFetchMode({
  controllers: [MyController],
  cloudflareStaticAssetsBinding: "COMPONENTS",
});

export default { fetch: app.fetch };
