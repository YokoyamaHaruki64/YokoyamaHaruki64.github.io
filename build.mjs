import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { runInNewContext } from "node:vm";
import renderWorkDetails from "./work-details.js";

const root = new URL("./", import.meta.url);
const output = new URL("build/", root);
const marker = "<!-- BUILD_WORK_DETAILS -->";
const siteFiles = [
  "assets",
  "style.css", "geometric.css", "loading.css",
  "theme.js", "skills.js", "about.js", "contact.js", "background.js", "work-details.js", "app.js", "hero.js", "loading.js",
  "data/skills.js", "data/about.js", "data/contact.js", "data/works.js", "data/hero-clips.js"
];

const sourceHTML = await readFile(new URL("index.html", root), "utf8");
if (sourceHTML.split(marker).length !== 2) {
  throw new Error("index.html に BUILD_WORK_DETAILS マーカーが1個必要です。");
}

const context = { window: {} };
const worksSource = await readFile(new URL("data/works.js", root), "utf8");
runInNewContext(worksSource, context, { filename: "data/works.js" });
const works = context.window.PORTFOLIO_WORKS;
const ids = new Set();
const templates = [];
for (const work of works) {
  if (typeof work.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.id) || ids.has(work.id)) {
    throw new Error(`作品IDが不正または重複しています: ${work.id}`);
  }
  ids.add(work.id);

  const expectedPath = `data/details/${work.id}.md`;
  if (work.detailsPath !== expectedPath) {
    throw new Error(`${work.id} の detailsPath は ${expectedPath} にしてください。`);
  }
  const markdown = await readFile(new URL(work.detailsPath, root), "utf8");
  try {
    templates.push(`<template id="work-details-${work.id}">\n${renderWorkDetails(markdown)}\n</template>`);
  } catch (cause) {
    throw new Error(`${work.detailsPath}: ${cause.message}`, { cause });
  }
}

if (existsSync(new URL("downloads/", root))) siteFiles.push("downloads");
await mkdir(new URL("data/", output), { recursive: true });
for (const path of siteFiles) {
  await cp(new URL(path, root), new URL(path, output), { recursive: true });
}
const html = sourceHTML.replace(marker, () => templates.join("\n  "));
await writeFile(new URL("index.html", output), html, "utf8");
console.log(`build/index.html を生成しました（作品詳細 ${templates.length} 件）。`);
