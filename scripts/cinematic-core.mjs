import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join, relative } from "node:path";

export const CONFIG_FILE = "cinematic.config.json";
export const CONTEXT_FILES = [
  CONFIG_FILE,
  "PROJECT_CONTEXT.md",
  "DESIGN_CONTEXT.md",
  "CONTENT_ASSUMPTIONS.md",
  "EXPERIENCE_PLAN.md",
  "ASSET_PLAN.md",
];

export const REQUIRED_CONTEXT_SECTIONS = {
  "PROJECT_CONTEXT.md": ["North star", "Verified facts", "Product contract", "Current implementation", "Approved design direction", "Assumptions and backlog", "Change protocol"],
  "DESIGN_CONTEXT.md": ["Art direction", "Design tokens", "Responsive composition", "Motion language", "Anti-patterns"],
  "CONTENT_ASSUMPTIONS.md": ["Verified content", "Assumptions", "Replacement protocol"],
  "EXPERIENCE_PLAN.md": ["First-viewport promise", "Chapter plan", "Primary action", "Responsive strategy"],
  "ASSET_PLAN.md": ["Asset inventory", "Loading strategy", "Responsive variants", "Licensing and provenance"],
};

export const INITIALIZER_FILES = [
  ["docs/templates/AGENTS.template.md", "AGENTS.md"],
  ["docs/templates/PROJECT_CONTEXT.template.md", "PROJECT_CONTEXT.md"],
  ["docs/templates/DESIGN_CONTEXT.template.md", "DESIGN_CONTEXT.md"],
  ["docs/templates/CONTENT_ASSUMPTIONS.template.md", "CONTENT_ASSUMPTIONS.md"],
  ["docs/templates/EXPERIENCE_PLAN.template.md", "EXPERIENCE_PLAN.md"],
  ["docs/templates/ASSET_PLAN.template.md", "ASSET_PLAN.md"],
  ["docs/templates/QA_REPORT.template.md", "QA_REPORT.md"],
  ["docs/templates/cinematic.config.template.json", "cinematic.config.json"],
];

const MOTION_MODES = new Set(["static", "reveal", "triggered-passage", "local-scroll-story"]);
const PLACEHOLDER_PATTERNS = [/\{\{[^}]+\}\}/, /\bTODO\b/i, /YYYY-MM-DD/, /one paragraph describing/i, /replace this/i];

export function parseCliArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) continue;
    const key = argument.slice(2);
    if (["dry-run", "force"].includes(key)) options[key] = true;
    else {
      options[key] = argv[index + 1];
      index += 1;
    }
  }
  return options;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function pushIf(errors, condition, path, message) {
  if (condition) errors.push({ code: "invalid_config", path, message });
}

function rejectUnknownKeys(errors, value, path, allowed) {
  if (!isObject(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) errors.push({ code: "invalid_config", path: path ? `${path}.${key}` : key, message: "Unknown configuration property." });
  }
}

export function validateConfigObject(config) {
  const errors = [];
  if (!isObject(config)) return [{ code: "invalid_config", path: "$", message: "Configuration must be an object." }];
  rejectUnknownKeys(errors, config, "", ["$schema", "schemaVersion", "project", "chapters", "responsive", "motion", "budgets", "accessibility", "exceptions"]);
  pushIf(errors, config.schemaVersion !== 1, "schemaVersion", "Only schema version 1 is supported.");
  pushIf(errors, !isObject(config.project), "project", "Project identity is required.");
  if (isObject(config.project)) {
    rejectUnknownKeys(errors, config.project, "project", ["name", "audience", "primaryAction", "firstViewportPromise"]);
    for (const key of ["name", "audience", "primaryAction", "firstViewportPromise"]) {
      pushIf(errors, !nonEmpty(config.project[key]), `project.${key}`, `${key} must be a non-empty string.`);
    }
  }

  pushIf(errors, !Array.isArray(config.chapters) || config.chapters.length === 0, "chapters", "At least one chapter is required.");
  if (Array.isArray(config.chapters)) {
    const ids = new Set();
    for (const [index, chapter] of config.chapters.entries()) {
      const path = `chapters[${index}]`;
      pushIf(errors, !isObject(chapter), path, "Chapter must be an object.");
      if (!isObject(chapter)) continue;
      rejectUnknownKeys(errors, chapter, path, ["id", "title", "motionMode", "composition", "decorativePlanes"]);
      pushIf(errors, !nonEmpty(chapter.id) || !/^[a-z][a-z0-9-]*$/.test(chapter.id), `${path}.id`, "Chapter ID must be unique kebab-case.");
      if (nonEmpty(chapter.id)) {
        pushIf(errors, ids.has(chapter.id), `${path}.id`, `Duplicate chapter ID: ${chapter.id}.`);
        ids.add(chapter.id);
      }
      pushIf(errors, !nonEmpty(chapter.title), `${path}.title`, "Chapter title is required.");
      pushIf(errors, !MOTION_MODES.has(chapter.motionMode), `${path}.motionMode`, "Unknown motion mode.");
      pushIf(errors, !nonEmpty(chapter.composition), `${path}.composition`, "Composition strategy is required.");
      pushIf(errors, !Number.isInteger(chapter.decorativePlanes) || chapter.decorativePlanes < 0, `${path}.decorativePlanes`, "Decorative planes must be a non-negative integer.");
    }
  }

  pushIf(errors, !isObject(config.responsive), "responsive", "Responsive contract is required.");
  if (isObject(config.responsive)) {
    rejectUnknownKeys(errors, config.responsive, "responsive", ["mobileBreakpointPx", "tabletBreakpointPx", "mobileStrategy"]);
    pushIf(errors, !Number.isInteger(config.responsive.mobileBreakpointPx) || config.responsive.mobileBreakpointPx < 320, "responsive.mobileBreakpointPx", "Mobile breakpoint must be at least 320px.");
    pushIf(errors, !Number.isInteger(config.responsive.tabletBreakpointPx) || config.responsive.tabletBreakpointPx < 600, "responsive.tabletBreakpointPx", "Tablet breakpoint must be at least 600px.");
    pushIf(errors, !["art-directed", "shared-composition"].includes(config.responsive.mobileStrategy), "responsive.mobileStrategy", "Unknown mobile strategy.");
  }

  pushIf(errors, !isObject(config.motion), "motion", "Motion contract is required.");
  if (isObject(config.motion)) {
    rejectUnknownKeys(errors, config.motion, "motion", ["runtime", "nativeScrolling", "globalScene", "pointerTracking", "maxDecorativePlanesPerChapter", "maxLocalScrollStories"]);
    pushIf(errors, config.motion.runtime !== "motion", "motion.runtime", "Motion is the supported runtime.");
    pushIf(errors, config.motion.nativeScrolling !== true, "motion.nativeScrolling", "Native scrolling must remain enabled.");
    pushIf(errors, config.motion.globalScene !== false, "motion.globalScene", "Global scenes are not allowed.");
    pushIf(errors, typeof config.motion.pointerTracking !== "boolean", "motion.pointerTracking", "Pointer tracking must be explicitly configured.");
    pushIf(errors, !Number.isInteger(config.motion.maxDecorativePlanesPerChapter) || config.motion.maxDecorativePlanesPerChapter < 0 || config.motion.maxDecorativePlanesPerChapter > 3, "motion.maxDecorativePlanesPerChapter", "Decorative-plane limit must be between 0 and 3.");
    pushIf(errors, !Number.isInteger(config.motion.maxLocalScrollStories) || config.motion.maxLocalScrollStories < 0 || config.motion.maxLocalScrollStories > 2, "motion.maxLocalScrollStories", "Local-scroll-story limit must be between 0 and 2.");
    if (Array.isArray(config.chapters)) {
      const localStories = config.chapters.filter((chapter) => chapter?.motionMode === "local-scroll-story").length;
      pushIf(errors, Number.isInteger(config.motion.maxLocalScrollStories) && localStories > config.motion.maxLocalScrollStories, "chapters", "Configured chapters exceed the local scroll story limit.");
      for (const [index, chapter] of config.chapters.entries()) {
        pushIf(errors, Number.isInteger(chapter?.decorativePlanes) && Number.isInteger(config.motion.maxDecorativePlanesPerChapter) && chapter.decorativePlanes > config.motion.maxDecorativePlanesPerChapter, `chapters[${index}].decorativePlanes`, "Chapter exceeds the decorative-plane limit.");
      }
    }
  }

  pushIf(errors, !isObject(config.budgets), "budgets", "Performance budgets are required.");
  if (isObject(config.budgets)) {
    rejectUnknownKeys(errors, config.budgets, "budgets", ["initialJavaScriptGzipKb", "cssGzipKb", "heroImageKb", "mobileImagesTotalKb", "desktopImagesTotalKb"]);
    for (const key of ["initialJavaScriptGzipKb", "cssGzipKb", "heroImageKb", "mobileImagesTotalKb", "desktopImagesTotalKb"]) {
      pushIf(errors, typeof config.budgets[key] !== "number" || config.budgets[key] <= 0, `budgets.${key}`, `${key} must be greater than zero.`);
    }
  }

  pushIf(errors, !isObject(config.accessibility), "accessibility", "Accessibility contract is required.");
  if (isObject(config.accessibility)) {
    rejectUnknownKeys(errors, config.accessibility, "accessibility", ["keyboard", "reducedMotion", "textZoomPercent", "contrast", "minimumTouchTargetPx"]);
    pushIf(errors, config.accessibility.keyboard !== true, "accessibility.keyboard", "Keyboard support is required.");
    pushIf(errors, config.accessibility.reducedMotion !== "complete-static", "accessibility.reducedMotion", "Reduced motion must render a complete static experience.");
    pushIf(errors, !Number.isInteger(config.accessibility.textZoomPercent) || config.accessibility.textZoomPercent < 200, "accessibility.textZoomPercent", "Text zoom must support at least 200%." );
    pushIf(errors, !["WCAG-AA", "WCAG-AAA"].includes(config.accessibility.contrast), "accessibility.contrast", "Contrast must target WCAG AA or AAA.");
    pushIf(errors, !Number.isInteger(config.accessibility.minimumTouchTargetPx) || config.accessibility.minimumTouchTargetPx < 44, "accessibility.minimumTouchTargetPx", "Touch targets must be at least 44px.");
  }

  pushIf(errors, !Array.isArray(config.exceptions), "exceptions", "Exceptions must be an array.");
  if (Array.isArray(config.exceptions)) {
    for (const [index, exception] of config.exceptions.entries()) {
      const path = `exceptions[${index}]`;
      pushIf(errors, !isObject(exception), path, "Exception must be an object.");
      if (!isObject(exception)) continue;
      rejectUnknownKeys(errors, exception, path, ["rule", "rationale", "approvedBy"]);
      pushIf(errors, !nonEmpty(exception.rule), `${path}.rule`, "Exception rule is required.");
      pushIf(errors, !nonEmpty(exception.rationale) || exception.rationale.trim().length < 12, `${path}.rationale`, "Exception rationale must be specific.");
      pushIf(errors, !nonEmpty(exception.approvedBy), `${path}.approvedBy`, "Exception approver is required.");
    }
  }
  return errors;
}

export async function loadConfig(root) {
  const source = await readFile(join(root, CONFIG_FILE), "utf8");
  return JSON.parse(source);
}

export function validateContextText(filename, text) {
  const errors = [];
  for (const section of REQUIRED_CONTEXT_SECTIONS[filename] ?? []) {
    if (!new RegExp(`^##\\s+${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "im").test(text)) {
      errors.push({ code: "missing_context_section", path: filename, message: `Missing section: ${section}.` });
    }
  }
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(text)) errors.push({ code: "placeholder_context", path: filename, message: `Unresolved placeholder matches ${pattern}.` });
  }
  return errors;
}

async function listSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listSourceFiles(path));
    else if (/\.(?:ts|tsx|js|jsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

function hasException(config, rule) {
  return config.exceptions?.some((exception) => exception.rule === rule);
}

export async function runProjectChecks(root) {
  const errors = [];
  const warnings = [];
  const inspectedFiles = [];
  let config;
  try {
    config = await loadConfig(root);
    inspectedFiles.push(CONFIG_FILE);
    errors.push(...validateConfigObject(config));
  } catch (error) {
    errors.push({ code: "config_read_error", path: CONFIG_FILE, message: error.message });
    return { ok: false, errors, warnings, inspectedFiles };
  }

  for (const filename of CONTEXT_FILES.slice(1)) {
    try {
      const text = await readFile(join(root, filename), "utf8");
      inspectedFiles.push(filename);
      errors.push(...validateContextText(filename, text));
    } catch (error) {
      errors.push({ code: "context_read_error", path: filename, message: error.message });
    }
  }

  try {
    const sourceFiles = await listSourceFiles(join(root, "src"));
    for (const path of sourceFiles) {
      const text = await readFile(path, "utf8");
      const displayPath = relative(root, path).replaceAll("\\", "/");
      inspectedFiles.push(displayPath);
      if (/addEventListener\s*\(\s*["']scroll["']/.test(text) && !hasException(config, "global-scroll-listener")) {
        errors.push({ code: "structural_guardrail", path: displayPath, message: "Global scroll listener requires a documented exception." });
      }
      if (/addEventListener\s*\(\s*["']pointermove["']/.test(text) && !config.motion.pointerTracking && !hasException(config, "pointer-tracking")) {
        errors.push({ code: "structural_guardrail", path: displayPath, message: "Pointer tracking is disabled by the project contract." });
      }
      if (/from\s+["'](?:gsap|three)["']/.test(text)) {
        errors.push({ code: "structural_guardrail", path: displayPath, message: "Only Motion is allowed as the animation runtime." });
      }
    }
  } catch (error) {
    warnings.push({ code: "source_scan_skipped", path: "src", message: error.message });
  }

  inspectedFiles.sort();
  return { ok: errors.length === 0, errors, warnings, inspectedFiles };
}

export function formatCheckResult(result) {
  const lines = [result.ok ? "Cinematic check passed." : "Cinematic check failed."];
  for (const error of result.errors) lines.push(`ERROR ${error.path}: ${error.message}`);
  for (const warning of result.warnings) lines.push(`WARN ${warning.path}: ${warning.message}`);
  lines.push(`${result.inspectedFiles.length} files inspected.`);
  return lines.join("\n");
}

export async function createContextPacket(root) {
  const files = [];
  for (const filename of CONTEXT_FILES) {
    const content = await readFile(join(root, filename), "utf8");
    files.push({ path: filename, content: filename.endsWith(".json") ? JSON.stringify(JSON.parse(content), null, 2) : content.trim() });
  }
  return { schemaVersion: 1, files };
}

export function formatContextMarkdown(packet) {
  return [
    "# Cinematic Agent Context Packet",
    "",
    ...packet.files.flatMap((file) => [
      `## ${file.path}`,
      "",
      file.path.endsWith(".json") ? `\`\`\`json\n${file.content}\n\`\`\`` : file.content,
      "",
    ]),
  ].join("\n").trimEnd();
}

export async function initializeProject({ frameworkRoot, targetRoot, projectName, dryRun = false, force = false, date = new Date().toISOString().slice(0, 10) }) {
  if (!nonEmpty(projectName)) throw new Error("Project name is required.");
  const exists = async (path) => access(path, constants.F_OK).then(() => true, () => false);
  const conflicts = [];
  for (const [, target] of INITIALIZER_FILES) {
    const path = join(targetRoot, target);
    if (await exists(path)) conflicts.push(target);
  }
  const result = {
    ok: force || conflicts.length === 0,
    dryRun,
    forced: force,
    project: projectName,
    files: INITIALIZER_FILES.map(([, target]) => target),
    conflicts,
  };
  if (!result.ok || dryRun) return result;

  const replacements = { "{{PROJECT_NAME}}": projectName, "{{DATE}}": date };
  const rendered = [];
  for (const [template, target] of INITIALIZER_FILES) {
    let content = await readFile(join(frameworkRoot, template), "utf8");
    for (const [needle, value] of Object.entries(replacements)) content = content.replaceAll(needle, value);
    rendered.push({ target, content });
  }
  for (const file of rendered) {
    const targetPath = join(targetRoot, file.target);
    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, file.content, "utf8");
  }
  return result;
}
