# fullsoak examples on Cloudflare Workers

## Intro

FullSoak is a no-build TypeScript fullstack SSR-first framework. As we don't
rely on a bundler, all files are served directly where they are. This can be
tricky on Cloudflare Workers due to the lack of support for native file system
APIs.

This repo serves as a Proof of Concept that FullSoak framework is compatible
with Cloudflare Workers with the correct setup.

WARNING: as the [FullSoak framework](https://jsr.io/@fullsoak/fullsoak) is still
in an early development phase, breaking changes are expected. When in doubt,
please feel free to open a PR / discussion. Thank you for your interest!

## Available commands

This repo is prepared for the Cloudflare Workers runtime. If you're familiar
with developing Cloudflare Workers apps, you will feel right at home. Please be
sure to check the configuration files (e.g. `tsconfig.json`, `wrangler.jsonc`,
etc.) to get an idea of what is configured to make a FullSoak app deployable on
Cloudflare Workers environment.

```bash
npm run dev
```

## Cloudflare Workers specific deep-dives

The topics below only apply when using FullSoak on Cloudflare Workers. For other
deploying destinations, we wouldn't face most of the challenges discussed here.

### The pragma comments on HtmlShell are a must-have

FullSoak provisions a battery-included JSX component known as `HtmlShell`. For
it to work properly on certain platforms / setups, the following pragma comments
are needed, so FullSoak ships this component with these comments on top:

```ts
/** @jsxRuntime automatic */
/** @jsxImportSource preact */
```

These comment get 'expanded' to the installation path of `preact` which is
defined by FullSoak. In Deno-compatible setups, everything resolves
automatically, but in environments like Cloudflare Workers, a bit of additional
guidance is needed.

The general setup is to alias in `tsconfig.json` like so:

```json
{
  "paths": {
    "npm:preact@10.25.4/jsx-runtime": ["./node_modules/preact/jsx-runtime"]
  }
}
```

On Cloudflare Workers, this is done via
[Module Aliasing](https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing).

(✓) so using the same approach, FullSoak framework should work for both
Cloudflare Workers and render.com (or similar non-Deno deployment envs).

---

### uglify-js is unsupported

Somehow `uglify-js` refers to `__require.resolve` which is probably not
understood in deployment environments like Cloudflare Workers (at least without
special catering). FullSoak uses `uglify-js` itself as a fallback when
`@swc/core` fails to load. So it may not be worth the efforts trying to
provision for `uglify-js`.

It's possible to
[alias](https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing)
`uglify-js` to something else that loads successfully

```json
{ "uglify-js": "/path/to/something/else" }
```

or use something else altogether. Either way, some room for improvements here.

(✓) later versions of FullSoak no longer hard-rely on `uglify-js`.

---

### @swc is unsupported

Latest FullSoak version (at writing time) still fails to start up on Cloudflare
Workers as `@swc/core` native binding is not supported. To unblock the process
startup, a workaround is to
[alias](https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing)
like so:

```jsonc
{
  "@swc/wasm": "./node_modules/@swc/core",
  "@swc/core-darwin-arm64": "./node_modules/@swc/core" // platform dependent - your mileage might vary
}
```

but that means `@swc/core` native binding itself is not usable, rendering the
library useless => a drop-in replacement is required anyways.

(✓) later versions of FullSoak employs `typescript` as a fallback.

Another improvement opportunity: make it work without the aliasing trick above,
too.

---

### fs.readFile is unsupported

FullSoak uses `fs.readFile` to serve `.css` and `.tsx` files for the components.
That is also not yet supported by Cloudflare Workers `uenv`.

(✓) resolved using a patch on `app.fetch` so `.css` and `.t|jsx` files are
loaded via Cloudflare Workers Static Assets instead of file system.

(❌) css content that is Server-side-rendered together with the initial HTML
content is not yet supported. A workaround is to inline CSS into the components,
or placing `<link>` elements. Whether it's possible to provide the same level of
support for this feature as it is on the other deployment platforms (Deno Deploy
/ render.com / self-host) is unknown at the moment.

---

## Other platforms

- Examples for Deno runtime: https://github.com/fullsoak/deno-examples
- Examples for Bun runtime: https://github.com/fullsoak/bun-examples
