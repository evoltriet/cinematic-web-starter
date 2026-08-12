import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const blocked = [
  /phuong/i,
  /\btriet\b/i,
  /jiva/i,
  /ninh\s*b/i,
  /invite_token/i,
  /resend/i,
  /chatgpt\.site/i,
  /appgprj_/i,
  /google\.com\/spreadsheets\/d\//i,
  /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/,
  /(?:api|access|auth|secret|private)[_-]?key\s*[=:]\s*["'][^"']{12,}/i,
];
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".md", ".json", ".yml", ".yaml", ".html", ""]);
const ignored = new Set(["node_modules", ".git", "dist", "playwright-report", "test-results"]);
const hits = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.name === "pnpm-lock.yaml") continue;
    const path = join(directory, entry.name);
    if (relative(".", path).replaceAll("\\", "/") === "scripts/check-sanitization.mjs") continue;
    if (entry.isDirectory()) await walk(path);
    else if (entry.name !== "LICENSE" && allowedExtensions.has(extname(entry.name))) {
      const text = await readFile(path, "utf8");
      blocked.forEach((pattern) => { if (pattern.test(text)) hits.push(`${relative(".", path)} matched ${pattern}`); });
    }
  }
}

await walk(".");
if (hits.length) {
  console.error("Sanitization check failed:\n" + hits.join("\n"));
  process.exit(1);
}
console.log("Sanitization check passed.");
