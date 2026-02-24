import { access, mkdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { aboutContent, heroObjects, projects } from "../src/siteData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const publicRoot = resolve(projectRoot, "public");

const assets = new Map();

const addAsset = (asset, label) => {
  if (!asset || typeof asset !== "object") {
    return;
  }

  const { local, remote } = asset;

  if (!local || !remote) {
    return;
  }

  const localPath = local.replace(/^\//, "");
  const existing = assets.get(localPath);

  if (existing && existing !== remote) {
    throw new Error(`Conflicting remote URL for ${label}: ${localPath}`);
  }

  assets.set(localPath, remote);
};

for (const item of heroObjects) {
  addAsset(item.src, `hero:${item.id}`);
}

for (const project of projects) {
  addAsset(project.cover, `${project.slug}:cover`);
  addAsset(project.hero, `${project.slug}:hero`);
  for (const [index, image] of project.gallery.entries()) {
    addAsset(image, `${project.slug}:gallery:${index}`);
  }
}

addAsset(aboutContent.image, "about:image");

const fileExists = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const download = async (remoteUrl, outputPath) => {
  const response = await fetch(remoteUrl);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, data);
  return data.length;
};

let downloaded = 0;
let skipped = 0;
let failed = 0;

console.log(`Found ${assets.size} assets to sync into /public/assets`);

for (const [localPath, remoteUrl] of assets.entries()) {
  const absolutePath = resolve(publicRoot, localPath);

  if (await fileExists(absolutePath)) {
    skipped += 1;
    console.log(`SKIP  ${localPath}`);
    continue;
  }

  try {
    const bytes = await download(remoteUrl, absolutePath);
    downloaded += 1;
    console.log(`OK    ${localPath} (${bytes} bytes)`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${localPath} <- ${remoteUrl}`);
    console.error(`      ${error.message}`);
  }
}

console.log("");
console.log(`Download summary: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);

if (failed > 0) {
  process.exitCode = 1;
}
