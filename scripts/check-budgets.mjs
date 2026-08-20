import { gzipSync } from "node:zlib";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const config = JSON.parse(await readFile("cinematic.config.json", "utf8"));
const limits = {
  ".js": config.budgets.initialJavaScriptGzipKb * 1024,
  ".css": config.budgets.cssGzipKb * 1024,
};
const files = await readdir("dist/assets");
const totals = { ".js": 0, ".css": 0 };
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const images = { all: 0, mobile: 0, desktop: 0, heroLargest: 0 };
for (const file of files) {
  const extension = extname(file);
  const path = join("dist/assets", file);
  if (extension in totals) totals[extension] += gzipSync(await readFile(path)).length;
  if (imageExtensions.has(extension)) {
    const bytes = (await stat(path)).size;
    images.all += bytes;
    if (/mobile|small|sm-/i.test(file)) images.mobile += bytes;
    if (/desktop|large|lg-/i.test(file)) images.desktop += bytes;
    if (/hero/i.test(file)) images.heroLargest = Math.max(images.heroLargest, bytes);
  }
}
for (const [extension, limit] of Object.entries(limits)) {
  const actual = totals[extension];
  console.log(`${extension}: ${(actual / 1024).toFixed(1)} KB gzip / ${(limit / 1024).toFixed(0)} KB`);
  if (actual > limit) process.exitCode = 1;
}

const imageLimits = {
  "hero image": config.budgets.heroImageKb * 1024,
  "mobile images": config.budgets.mobileImagesTotalKb * 1024,
  "desktop images": config.budgets.desktopImagesTotalKb * 1024,
};
const imageActuals = {
  "hero image": images.heroLargest,
  "mobile images": images.mobile,
  "desktop images": Math.max(images.desktop, images.all),
};
for (const [label, limit] of Object.entries(imageLimits)) {
  const actual = imageActuals[label];
  console.log(`${label}: ${(actual / 1024).toFixed(1)} KB / ${(limit / 1024).toFixed(0)} KB`);
  if (actual > limit) process.exitCode = 1;
}
