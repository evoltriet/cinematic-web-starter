import { resolve } from "node:path";
import { formatCheckResult, parseCliArgs, runProjectChecks } from "./cinematic-core.mjs";

const options = parseCliArgs(process.argv.slice(2));
if (options.format && !["text", "json"].includes(options.format)) {
  console.error("--format must be text or json.");
  process.exit(1);
}
const root = resolve(options.root ?? process.cwd());
const result = await runProjectChecks(root);
console.log(options.format === "json" ? JSON.stringify(result, null, 2) : formatCheckResult(result));
if (!result.ok) process.exitCode = 1;
