import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The public site is prerendered and does not use on-demand revalidation.
// Keep its immutable build cache inside Workers Static Assets and intercept
// cache hits before loading the full NextServer runtime.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
