import { resolve } from "node:path";
import { createContextPacket, formatContextMarkdown, parseCliArgs } from "./cinematic-core.mjs";

const options = parseCliArgs(process.argv.slice(2));
if (options.format && !["markdown", "json"].includes(options.format)) {
  console.error("--format must be markdown or json.");
  process.exit(1);
}
const root = resolve(options.root ?? process.cwd());
const packet = await createContextPacket(root);
console.log(options.format === "json" ? JSON.stringify(packet, null, 2) : formatContextMarkdown(packet));
