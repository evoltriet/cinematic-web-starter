import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CONTEXT_FILES,
  createContextPacket,
  formatContextMarkdown,
  formatCheckResult,
  initializeProject,
  runProjectChecks,
  validateConfigObject,
  validateContextText,
} from "../scripts/cinematic-core.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseConfig = JSON.parse(await readFile(join(root, "cinematic.config.json"), "utf8"));

const clone = (value) => JSON.parse(JSON.stringify(value));

async function makeValidFixture() {
  const fixture = await mkdtemp(join(tmpdir(), "cinematic-check-"));
  await mkdir(join(fixture, "src"));
  await writeFile(join(fixture, "src", "main.ts"), "export const experience = true;\n");
  for (const filename of CONTEXT_FILES) await cp(join(root, filename), join(fixture, filename));
  return fixture;
}

test("versioned schema and project configuration are valid", async () => {
  const schema = JSON.parse(await readFile(join(root, "schemas", "cinematic-config.schema.json"), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.properties.schemaVersion.const, 1);
  assert.deepEqual(validateConfigObject(baseConfig), []);
});

test("configuration rejects unknown versions and invalid motion modes", () => {
  const unknownVersion = clone(baseConfig);
  unknownVersion.schemaVersion = 9;
  assert.ok(validateConfigObject(unknownVersion).some((error) => error.path === "schemaVersion"));

  const invalidMode = clone(baseConfig);
  invalidMode.chapters[0].motionMode = "cinematic-magic";
  assert.ok(validateConfigObject(invalidMode).some((error) => error.path.endsWith("motionMode")));
});

test("configuration rejects duplicate chapter IDs and excessive scene limits", () => {
  const duplicate = clone(baseConfig);
  duplicate.chapters[1].id = duplicate.chapters[0].id;
  assert.ok(validateConfigObject(duplicate).some((error) => /Duplicate chapter/.test(error.message)));

  const excessivePlanes = clone(baseConfig);
  excessivePlanes.chapters[0].decorativePlanes = 3;
  assert.ok(validateConfigObject(excessivePlanes).some((error) => /decorative-plane limit/.test(error.message)));

  const excessiveStories = clone(baseConfig);
  excessiveStories.motion.maxLocalScrollStories = 0;
  assert.ok(validateConfigObject(excessiveStories).some((error) => /local scroll story limit/.test(error.message)));
});

test("configuration rejects malformed exceptions", () => {
  const config = clone(baseConfig);
  config.exceptions = [{ rule: "pointer-tracking", rationale: "short", approvedBy: "" }];
  const errors = validateConfigObject(config);
  assert.ok(errors.some((error) => error.path.endsWith("rationale")));
  assert.ok(errors.some((error) => error.path.endsWith("approvedBy")));
});

test("configuration rejects unknown properties", () => {
  const config = clone(baseConfig);
  config.motion.magic = true;
  assert.ok(validateConfigObject(config).some((error) => error.path === "motion.magic"));
});

test("initializer dry-run is deterministic and writes nothing", async () => {
  const target = await mkdtemp(join(tmpdir(), "cinematic-init-dry-"));
  const options = { frameworkRoot: root, targetRoot: target, projectName: "Luminous Archive", dryRun: true, date: "2026-08-20" };
  const first = await initializeProject(options);
  const second = await initializeProject(options);
  assert.deepEqual(first, second);
  assert.equal(first.dryRun, true);
  await assert.rejects(readFile(join(target, "PROJECT_CONTEXT.md"), "utf8"));
});

test("initializer refuses partial overwrite and force touches only owned files", async () => {
  const target = await mkdtemp(join(tmpdir(), "cinematic-init-force-"));
  await mkdir(join(target, "src"));
  await writeFile(join(target, "AGENTS.md"), "keep\n");
  await writeFile(join(target, "src", "custom.ts"), "export const untouched = true;\n");

  const blocked = await initializeProject({ frameworkRoot: root, targetRoot: target, projectName: "Luminous Archive", date: "2026-08-20" });
  assert.equal(blocked.ok, false);
  await assert.rejects(readFile(join(target, "PROJECT_CONTEXT.md"), "utf8"));

  const forced = await initializeProject({ frameworkRoot: root, targetRoot: target, projectName: "Luminous Archive", force: true, date: "2026-08-20" });
  assert.equal(forced.ok, true);
  assert.match(await readFile(join(target, "PROJECT_CONTEXT.md"), "utf8"), /Luminous Archive/);
  assert.equal(await readFile(join(target, "src", "custom.ts"), "utf8"), "export const untouched = true;\n");
});

test("context packet is ordered, allowlisted, deterministic, and secret-safe", async () => {
  const fixture = await makeValidFixture();
  await writeFile(join(fixture, ".env"), "AGENT_SECRET=do-not-read\n");
  await writeFile(join(fixture, "UNLISTED.md"), "do-not-include\n");
  const first = await createContextPacket(fixture);
  const second = await createContextPacket(fixture);
  assert.deepEqual(first, second);
  assert.deepEqual(first.files.map((file) => file.path), CONTEXT_FILES);
  const markdown = formatContextMarkdown(first);
  assert.doesNotMatch(markdown, /do-not-read|do-not-include|\.env/);
});

test("context validation catches missing and placeholder sections", () => {
  const text = "# Project Context\n\n## North star\n\nTODO\n";
  const errors = validateContextText("PROJECT_CONTEXT.md", text);
  assert.ok(errors.some((error) => error.code === "missing_context_section"));
  assert.ok(errors.some((error) => error.code === "placeholder_context"));
});

test("cinematic check emits machine-readable success and failure", async () => {
  const valid = await makeValidFixture();
  const success = await runProjectChecks(valid);
  assert.equal(success.ok, true);
  assert.equal(JSON.parse(JSON.stringify(success)).ok, true);
  assert.match(formatCheckResult(success), /passed/);

  const invalid = await makeValidFixture();
  const invalidConfig = clone(baseConfig);
  invalidConfig.chapters[0].motionMode = "unknown";
  await writeFile(join(invalid, "cinematic.config.json"), JSON.stringify(invalidConfig, null, 2));
  const result = await runProjectChecks(invalid);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.path.endsWith("motionMode")));
  assert.match(formatCheckResult(result), /failed/);
});

test("project checks reject unapproved global listeners without logging source", async () => {
  const fixture = await makeValidFixture();
  await writeFile(join(fixture, "src", "main.ts"), "window.addEventListener('scroll', () => secretValue);\n");
  const result = await runProjectChecks(fixture);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.code === "structural_guardrail"));
  assert.doesNotMatch(JSON.stringify(result), /secretValue/);
});
