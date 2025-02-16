import type { FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";

export const MyApp: FunctionComponent = () => {
  useEffect(() => {
    alert('FullSoak App running on Cloudflare Workers');
  });

  return (
    <div style={{ fontFamily: "monospace" }}>Hello, Cloudflare Workers</div>
  );
};
