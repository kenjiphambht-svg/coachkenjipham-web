import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ERROR_PAGES = new Set(["404.html", "500.html"]);
const GENERATED_HEADERS_MARKER = "# Generated prerendered page cache headers";

async function listHtmlFiles(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(root, absolute)));
      continue;
    }

    const relative = path.relative(root, absolute);
    if (entry.isFile() && relative.endsWith(".html") && !ERROR_PAGES.has(relative)) {
      files.push(relative);
    }
  }

  return files.sort();
}

export async function promoteOpenNextStaticPages({ sourceDir, assetsDir }) {
  const pages = await listHtmlFiles(sourceDir);

  for (const relative of pages) {
    const destination = path.join(assetsDir, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(sourceDir, relative), destination);
  }

  await writeStaticPageHeaders(assetsDir, pages);

  return pages;
}

async function writeStaticPageHeaders(assetsDir, pages) {
  const headersPath = path.join(assetsDir, "_headers");
  let existing = "";

  try {
    existing = await readFile(headersPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const retained = existing.split(GENERATED_HEADERS_MARKER, 1)[0].trimEnd();
  const generated = pages
    .map((page) => {
      const route = page === "index.html" ? "/" : `/${page.slice(0, -".html".length)}`;
      return `${route}\n  Cache-Control: public,max-age=0,s-maxage=31536000,must-revalidate`;
    })
    .join("\n\n");

  await writeFile(
    headersPath,
    `${retained}\n\n${GENERATED_HEADERS_MARKER}\n${generated}\n`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const projectRoot = process.cwd();
  const pages = await promoteOpenNextStaticPages({
    sourceDir: path.join(
      projectRoot,
      ".open-next/server-functions/default/.next/server/pages",
    ),
    assetsDir: path.join(projectRoot, ".open-next/assets"),
  });

  console.log(`Promoted ${pages.length} prerendered HTML pages to Workers Static Assets.`);
}
