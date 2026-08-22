import { cp, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ERROR_ROUTES = new Set(["/404", "/500"]);

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function classifyPage(route, artifact, prerenderManifest) {
  if (
    ERROR_ROUTES.has(route) ||
    !artifact.startsWith("pages/") ||
    !artifact.endsWith(".html")
  ) {
    return { eligible: false, reason: "not-a-public-html-route" };
  }

  if (prerenderManifest.notFoundRoutes.includes(route)) {
    return { eligible: false, reason: "not-found-route" };
  }

  if (Object.hasOwn(prerenderManifest.dynamicRoutes, route)) {
    return { eligible: false, reason: "dynamic-prerender-route" };
  }

  const prerender = prerenderManifest.routes[route];
  if (!prerender) {
    // Under pinned Next 15.5.21 Pages Router semantics, an HTML artifact in
    // pages-manifest without a prerender-manifest record is an Automatic Static
    // Optimization result: there is no data route or revalidation contract.
    return { eligible: true, reason: "automatic-static-optimization" };
  }

  const foreverStatic =
    prerender.initialRevalidateSeconds === false &&
    prerender.initialExpireSeconds == null &&
    prerender.srcRoute === null &&
    prerender.experimentalPPR == null &&
    prerender.renderingMode == null;

  return foreverStatic
    ? { eligible: true, reason: "non-revalidating-prerender" }
    : { eligible: false, reason: "revalidating-or-unknown-prerender" };
}

export async function promoteOpenNextStaticPages({
  nextDir,
  sourceDir,
  assetsDir,
}) {
  const [pagesManifest, prerenderManifest] = await Promise.all([
    readJson(path.join(nextDir, "server/pages-manifest.json")),
    readJson(path.join(nextDir, "prerender-manifest.json")),
  ]);

  if (
    prerenderManifest.version !== 4 ||
    !prerenderManifest.routes ||
    !prerenderManifest.dynamicRoutes ||
    !Array.isArray(prerenderManifest.notFoundRoutes)
  ) {
    throw new Error("Unsupported or incomplete Next prerender manifest; refusing promotion.");
  }

  const promoted = [];
  const skipped = [];

  for (const [route, artifact] of Object.entries(pagesManifest).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const classification = classifyPage(route, artifact, prerenderManifest);
    if (!classification.eligible) {
      if (artifact.endsWith(".html") && !ERROR_ROUTES.has(route)) {
        skipped.push({ route, reason: classification.reason });
      }
      continue;
    }

    const relative = path.relative("pages", artifact);
    const destination = path.join(assetsDir, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(sourceDir, relative), destination);
    promoted.push({ route, file: relative, reason: classification.reason });
  }

  return { promoted, skipped };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const projectRoot = process.cwd();
  const nextDir = path.join(
    projectRoot,
    ".open-next/server-functions/default/.next",
  );
  const result = await promoteOpenNextStaticPages({
    nextDir,
    sourceDir: path.join(nextDir, "server/pages"),
    assetsDir: path.join(projectRoot, ".open-next/assets"),
  });

  console.log(
    `Promoted ${result.promoted.length} manifest-verified static HTML pages to Workers Static Assets.`,
  );
  for (const route of result.skipped) {
    console.log(`Kept ${route.route} Worker-handled: ${route.reason}.`);
  }
}
