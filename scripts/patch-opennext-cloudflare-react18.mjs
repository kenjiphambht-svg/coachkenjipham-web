import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// Backport the one-line fix proposed in upstream issue #1325. OpenNext 1.20.2
// otherwise replaces React 18's intentionally missing server.edge export with
// an untyped Error, preventing Next.js from falling back to server.browser.
// The version and source guards below make an upstream change fail visibly.
// Cloudflare Workers Builds injects WORKERS_CI=1. Normal/Vercel installs run
// this postinstall entry point without that marker and must not mutate the
// adapter. Local Cloudflare builds opt in with the explicit CLI flag.
const explicitCloudflareBuild = process.argv.includes("--cloudflare-build");
const workersCiBuild = process.env.WORKERS_CI === "1";

if (!explicitCloudflareBuild && !workersCiBuild) {
  console.log(
    "Skipping OpenNext #1325 patch outside the Cloudflare build path."
  );
  process.exit(0);
}

const require = createRequire(import.meta.url);
let adapterEntryPath;
try {
  adapterEntryPath = require.resolve("@opennextjs/cloudflare");
} catch (error) {
  if (error?.code === "MODULE_NOT_FOUND") {
    console.log("Skipping OpenNext patch because the optional dev dependency is absent.");
    process.exit(0);
  }
  throw error;
}
const adapterRoot = dirname(dirname(dirname(adapterEntryPath)));
const adapterPackagePath = join(adapterRoot, "package.json");
const adapterPackage = require(adapterPackagePath);

if (adapterPackage.version !== "1.20.2") {
  throw new Error(
    `Refusing to patch @opennextjs/cloudflare ${adapterPackage.version}; expected 1.20.2.`
  );
}

const pluginPath = join(
  adapterRoot,
  "dist/cli/build/patches/plugins/optional-deps.js"
);
const source = await readFile(pluginPath, "utf8");
const original =
  "contents: `throw new Error('Missing optional dependency \"${pluginData.name}\"')`,";
const patched =
  "contents: `throw Object.assign(new Error('Missing optional dependency \"${pluginData.name}\"'), { code: \"MODULE_NOT_FOUND\" })`,";

const originalCount = source.split(original).length - 1;
const patchedCount = source.split(patched).length - 1;

if (originalCount === 1 && patchedCount === 0) {
  await writeFile(pluginPath, source.replace(original, patched));
  console.log(
    "Applied OpenNext #1325 React 18 fallback patch to @opennextjs/cloudflare 1.20.2."
  );
} else if (originalCount === 0 && patchedCount === 1) {
  console.log("OpenNext #1325 React 18 fallback patch is already applied.");
} else {
  throw new Error(
    `OpenNext #1325 patch guard failed (original=${originalCount}, patched=${patchedCount}).`
  );
}
