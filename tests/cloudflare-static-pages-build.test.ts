import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { promoteOpenNextStaticPages } from "../scripts/promote-opennext-static-pages.mjs";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

describe("Cloudflare static page promotion", () => {
  it("promotes only manifest-verified forever-static routes", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "essence-cf-static-"));
    temporaryDirectories.push(root);

    const nextDir = path.join(root, ".next");
    const sourceDir = path.join(root, "pages");
    const assetsDir = path.join(root, "assets");
    await Promise.all([
      writeFileAt(sourceDir, "index.html", "home"),
      writeFileAt(sourceDir, "static-ssg.html", "static ssg"),
      writeFileAt(sourceDir, "isr.html", "isr"),
      writeFileAt(sourceDir, "unknown.html", "unknown"),
      writeFileAt(sourceDir, "404.html", "not found"),
      writeJson(nextDir, "server/pages-manifest.json", {
        "/": "pages/index.html",
        "/static-ssg": "pages/static-ssg.html",
        "/isr": "pages/isr.html",
        "/unknown": "pages/unknown.html",
        "/404": "pages/404.html",
        "/api/runtime": "pages/api/runtime.js",
      }),
      writeJson(nextDir, "prerender-manifest.json", prerenderManifest({
        "/static-ssg": safePrerender(),
        "/isr": { ...safePrerender(), initialRevalidateSeconds: 60 },
        "/unknown": { dataRoute: "/_next/data/build/unknown.json" },
      })),
    ]);

    const result = await promoteOpenNextStaticPages({ nextDir, sourceDir, assetsDir });

    expect(result.promoted).toEqual([
      { route: "/", file: "index.html", reason: "automatic-static-optimization" },
      {
        route: "/static-ssg",
        file: "static-ssg.html",
        reason: "non-revalidating-prerender",
      },
    ]);
    expect(result.skipped).toEqual([
      { route: "/isr", reason: "revalidating-or-unknown-prerender" },
      { route: "/unknown", reason: "revalidating-or-unknown-prerender" },
    ]);
    await expect(readFile(path.join(assetsDir, "index.html"), "utf8")).resolves.toBe(
      "home",
    );
    await expect(readFile(path.join(assetsDir, "static-ssg.html"), "utf8")).resolves.toBe(
      "static ssg",
    );
    await expect(readFile(path.join(assetsDir, "isr.html"), "utf8")).rejects.toThrow();
    await expect(readFile(path.join(assetsDir, "unknown.html"), "utf8")).rejects.toThrow();
    await expect(readFile(path.join(assetsDir, "404.html"), "utf8")).rejects.toThrow();
  });

  it("does not consume one _headers rule per promoted page", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "essence-cf-scale-"));
    temporaryDirectories.push(root);

    const nextDir = path.join(root, ".next");
    const sourceDir = path.join(root, "pages");
    const assetsDir = path.join(root, "assets");
    const pagesManifest: Record<string, string> = {};
    const writes = [];

    for (let index = 1; index <= 125; index += 1) {
      const route = `/page-${index}`;
      const file = `page-${index}.html`;
      pagesManifest[route] = `pages/${file}`;
      writes.push(writeFileAt(sourceDir, file, route));
    }

    const headers = "/*\n  X-Content-Type-Options: nosniff\n\n/_next/static/*\n  Cache-Control: public,max-age=31536000,immutable\n";
    writes.push(
      writeFileAt(assetsDir, "_headers", headers),
      writeJson(nextDir, "server/pages-manifest.json", pagesManifest),
      writeJson(nextDir, "prerender-manifest.json", prerenderManifest({})),
    );
    await Promise.all(writes);

    const result = await promoteOpenNextStaticPages({ nextDir, sourceDir, assetsDir });

    expect(result.promoted).toHaveLength(125);
    await expect(readFile(path.join(assetsDir, "_headers"), "utf8")).resolves.toBe(headers);
  });
});

function prerenderManifest(routes: Record<string, unknown>) {
  return { version: 4, routes, dynamicRoutes: {}, notFoundRoutes: [], preview: {} };
}

function safePrerender() {
  return {
    dataRoute: "/_next/data/build/static.json",
    initialRevalidateSeconds: false,
    srcRoute: null,
    experimentalPPR: undefined,
    renderingMode: undefined,
    allowHeader: [],
  };
}

async function writeJson(root: string, relative: string, value: unknown) {
  await writeFileAt(root, relative, JSON.stringify(value));
}

async function writeFileAt(root: string, relative: string, contents: string) {
  const destination = path.join(root, relative);
  await mkdirForFile(destination);
  await writeFile(destination, contents);
}

async function mkdirForFile(file: string) {
  await mkdir(path.dirname(file), { recursive: true });
}
