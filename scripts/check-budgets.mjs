import { gzipSync } from "node:zlib";
import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const limits = { ".js": 180 * 1024, ".css": 30 * 1024 };
const files = await readdir("dist/assets");
const totals = { ".js": 0, ".css": 0 };
for (const file of files) {
  const extension = extname(file);
  if (!(extension in totals)) continue;
  totals[extension] += gzipSync(await readFile(join("dist/assets", file))).length;
}
for (const [extension, limit] of Object.entries(limits)) {
  const actual = totals[extension];
  console.log(`${extension}: ${(actual / 1024).toFixed(1)} KB gzip / ${(limit / 1024).toFixed(0)} KB`);
  if (actual > limit) process.exitCode = 1;
}
