import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineWorkersConfig({
  plugins: [
    nodePolyfills({
      include: ["os", "https"],
      // @TODO find a way to mock `process.cwd()` for the test env
      // globals: { process: true },
      // overrides: {
      // 	"process": "???",
      // },
    }),
  ],
  test: {
    globals: true,
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
      },
    },
  },
});
