import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeProject, parseCliArgs } from "./cinematic-core.mjs";

const scriptRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const options = parseCliArgs(process.argv.slice(2));
if (options.format && !["text", "json"].includes(options.format)) {
  console.error("--format must be text or json.");
  process.exit(1);
}
const targetRoot = resolve(options.root ?? process.cwd());
const projectName = options.project?.trim();
if (!projectName) {
  console.error("Usage: pnpm cinematic:init -- --project \"Project Name\" [--dry-run] [--force]");
  process.exit(1);
}

const result = await initializeProject({
  frameworkRoot: scriptRoot,
  targetRoot,
  projectName,
  dryRun: Boolean(options["dry-run"]),
  force: Boolean(options.force),
});

if (!result.ok) {
  console.log(options.format === "json" ? JSON.stringify(result, null, 2) : `No files written. Existing framework-owned files: ${result.conflicts.join(", ")}. Use --force to replace only these files.`);
  process.exit(1);
}

console.log(options.format === "json" ? JSON.stringify(result, null, 2) : `${result.dryRun ? "Would initialize" : "Initialized"} ${result.files.length} framework-owned files for ${projectName}.`);
