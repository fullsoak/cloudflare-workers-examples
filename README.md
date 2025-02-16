# fullsoak examples on Cloudflare Workers

## Intro

FullSoak is a no-build TypeScript fullstack SSR-first framework. As we don't
rely on a bundler, all files are served directly where they are. This can be
tricky on Cloudflare Workers due to the lack of support for native file system
APIs.

This repo serves as a Proof of Concept that FullSoak framework is compatible
with Cloudflare Workers with the correct setup.

## Deep-dives

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

### uglify-js is a no-go

Because somehow uglify-js refers to `__require.resolve` which is probably not
understood in modern deployment environments like Cloudflare Workers (at least
without special catering). For just the uglifying need, it may not be worth the
efforts trying to provision `uglify-js`.

It's possible to
[alias](https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing)
`uglify-js` to something else that loads successfully

```json
{ "uglify-js": "/path/to/something/else" }
```

but shouldn't we do away with uglify-js from the first place anyways?

(✓) later versions of FullSoak no longer hard-rely on `uglify-js`.

---

### @swc is a no-go

To unblock the process startup, a workaround is to
[alias](https://developers.cloudflare.com/workers/wrangler/configuration/#module-aliasing)
like so:

```jsonc
{
  "@swc/wasm": "./node_modules/@swc/core",
  "@swc/core-darwin-arm64": "./node_modules/@swc/core" // platform dependent - your mileage might vary
}
```

but that means `@swc/core` native binding itself is not usable, rendering the
entire library useless => a drop-in replacement is required anyways.

(✓) later versions of FullSoak employs `typescript` as a fallback.

---

### fs.readFile is a no go

FullSoak uses `fs.readFile` to serve `.css` and `.tsx` files for the components.
That is also not yet supported by Cloudflare Workers `uenv`.

(✓) resolved using a patch on `app.fetch` so `.css` and `.t|jsx` files are
loaded via Cloudflare Workers Static Assets instead of file system.

---
