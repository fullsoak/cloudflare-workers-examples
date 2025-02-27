import { FOO } from "./_lab/foo.js";

export const ExperimentalBadge = () => (
  <p>
    {`Experimental Support for Cloudflare Workers - Please be aware of ${FOO} 🐛 🐜 🐞 !!!`}
  </p>
);
