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
  it("promotes prerendered routes but leaves error pages to the Worker", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "essence-cf-static-"));
    temporaryDirectories.push(root);

    const sourceDir = path.join(root, "pages");
    const assetsDir = path.join(root, "assets");
    await Promise.all([
      writeHtml(sourceDir, "index.html", "home"),
      writeHtml(sourceDir, "ve-kenji.html", "kenji"),
      writeHtml(sourceDir, "lang-90/dat-phien.html", "nested"),
      writeHtml(sourceDir, "404.html", "not found"),
      writeHtml(sourceDir, "500.html", "error"),
    ]);

    await expect(
      promoteOpenNextStaticPages({ sourceDir, assetsDir }),
    ).resolves.toEqual([
      "index.html",
      "lang-90/dat-phien.html",
      "ve-kenji.html",
    ]);

    await expect(readFile(path.join(assetsDir, "index.html"), "utf8")).resolves.toBe(
      "home",
    );
    await expect(
      readFile(path.join(assetsDir, "lang-90/dat-phien.html"), "utf8"),
    ).resolves.toBe("nested");
    await expect(readFile(path.join(assetsDir, "404.html"), "utf8")).rejects.toThrow();

    await expect(readFile(path.join(assetsDir, "_headers"), "utf8")).resolves.toContain(
      "/lang-90/dat-phien\n  Cache-Control: public,max-age=0,s-maxage=31536000,must-revalidate",
    );
  });
});

async function writeHtml(root: string, relative: string, contents: string) {
  const destination = path.join(root, relative);
  await mkdirForFile(destination);
  await writeFile(destination, contents);
}

async function mkdirForFile(file: string) {
  await mkdir(path.dirname(file), { recursive: true });
}
