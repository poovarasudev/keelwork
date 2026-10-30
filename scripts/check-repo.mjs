#!/usr/bin/env node
// Checks the repo's structural rules (CLAUDE.md, .agents/invocation.md,
// .agents/writing-docs.md, FORK-CHANGES.md and the SRD's N1/N2/N5) without a
// model. Exits 1 on any error; warnings are printed but don't fail.
//
//   node scripts/check-repo.mjs

import { createHash } from "node:crypto";
import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(repo, p), "utf8");
const errors = [];
const warnings = [];
const error = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const PROMOTED = ["engineering", "productivity"];
const NON_PROMOTED = ["misc", "in-progress", "deprecated"];
const KEELWORK_DOCS = "https://github.com/poovarasudev/keelwork/blob/main/docs/";

// N1: model-invoked description budget. Upstream v1.3.1 shipped 11 model-invoked
// skills with 2,152 description characters in total. Keelwork adds agent-callable
// skills, so the total grows; these caps keep it close and keep each new one short.
const DESCRIPTION_TOTAL_CAP = 3600;
const KEELWORK_DESCRIPTION_CAP = 180;

// --- Skills ------------------------------------------------------------------

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return fm;
}

const skills = [];
for (const bucket of [...PROMOTED, ...NON_PROMOTED]) {
  const dir = join(repo, "skills", bucket);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    const skillMd = join(dir, name, "SKILL.md");
    if (!existsSync(skillMd)) continue;
    const text = readFileSync(skillMd, "utf8");
    const fm = frontmatter(text);
    const rel = `skills/${bucket}/${name}`;
    if (!fm) {
      error(`${rel}/SKILL.md: missing or malformed frontmatter`);
      continue;
    }
    if (fm.name !== name) error(`${rel}/SKILL.md: name "${fm.name}" doesn't match its folder`);
    if (!fm.description) error(`${rel}/SKILL.md: no description`);
    if (/\$ARGUMENTS/.test(text)) warn(`${rel}/SKILL.md: uses $ARGUMENTS, which not every harness substitutes`);
    skills.push({
      bucket,
      name,
      rel,
      promoted: PROMOTED.includes(bucket),
      userInvoked: fm["disable-model-invocation"] === "true",
      description: fm.description ?? "",
      text,
    });
  }
}

// Invocation: frontmatter and agents/openai.yaml agree.
for (const s of skills) {
  const yamlPath = join(repo, s.rel, "agents", "openai.yaml");
  if (!existsSync(yamlPath)) {
    error(`${s.rel}: missing agents/openai.yaml`);
    continue;
  }
  const yaml = readFileSync(yamlPath, "utf8");
  const policyOff = /allow_implicit_invocation:\s*false/.test(yaml);
  if (s.userInvoked !== policyOff) {
    error(`${s.rel}: disable-model-invocation (${s.userInvoked}) and openai.yaml allow_implicit_invocation:false (${policyOff}) disagree`);
  }
  if (!/display_name:/.test(yaml) || !/short_description:/.test(yaml)) {
    error(`${s.rel}/agents/openai.yaml: needs interface.display_name and interface.short_description`);
  }
}

// Plugin manifest ships exactly the promoted set.
const plugin = JSON.parse(read(".claude-plugin/plugin.json"));
const pluginSkills = new Set(plugin.skills.map((p) => p.replace(/^\.\//, "")));
for (const s of skills) {
  if (s.promoted && !pluginSkills.has(s.rel)) error(`${s.rel}: promoted but missing from plugin.json`);
  if (!s.promoted && pluginSkills.has(s.rel)) error(`${s.rel}: not promoted but listed in plugin.json`);
}
for (const p of pluginSkills) {
  if (!existsSync(join(repo, p, "SKILL.md"))) error(`plugin.json lists ${p}, which has no SKILL.md`);
}
const pkg = JSON.parse(read("package.json"));
if (pkg.version !== plugin.version) error(`plugin.json version ${plugin.version} != package.json ${pkg.version}`);

// READMEs: top-level and bucket, linked and grouped by invocation.
function groupOf(text, linkIndex) {
  const before = text.slice(0, linkIndex);
  const user = before.lastIndexOf("**User-invoked**");
  const userH = before.lastIndexOf("## User-invoked");
  const model = before.lastIndexOf("**Model-invoked**");
  const modelH = before.lastIndexOf("## Model-invoked");
  const u = Math.max(user, userH);
  const m = Math.max(model, modelH);
  if (u < 0 && m < 0) return null;
  return u > m ? "user" : "model";
}

const readme = read("README.md");
const referenceStart = readme.indexOf("## Reference");
for (const s of skills) {
  const link = `](./${s.rel}/SKILL.md)`;
  const entry = `**[${s.name}](./${s.rel}/SKILL.md)**`;
  if (s.promoted) {
    const at = readme.indexOf(entry, referenceStart);
    if (at < 0) {
      error(`README.md: no Reference entry linking ${s.name} to its SKILL.md`);
    } else {
      const g = groupOf(readme.slice(referenceStart), at - referenceStart);
      const want = s.userInvoked ? "user" : "model";
      if (g !== want) error(`README.md: ${s.name} is listed under ${g}-invoked but is ${want}-invoked`);
    }
  } else if (readme.includes(link)) {
    error(`README.md: links non-promoted skill ${s.name}`);
  }

  const bucketReadme = join(repo, "skills", s.bucket, "README.md");
  if (!existsSync(bucketReadme)) {
    error(`skills/${s.bucket}/README.md: missing`);
    continue;
  }
  const bt = readFileSync(bucketReadme, "utf8");
  const bEntry = `**[${s.name}](./${s.name}/SKILL.md)**`;
  const at = bt.indexOf(bEntry);
  if (at < 0) {
    error(`skills/${s.bucket}/README.md: no entry linking ${s.name} to its SKILL.md`);
  } else if (s.promoted) {
    const g = groupOf(bt, at);
    const want = s.userInvoked ? "user" : "model";
    if (g !== want) error(`skills/${s.bucket}/README.md: ${s.name} is listed under ${g}-invoked but is ${want}-invoked`);
  }
}

// --- Fork log and ownership ----------------------------------------------------

const forkChanges = read("FORK-CHANGES.md");
const keelworkOwned = new Set();
const ownedSection = forkChanges.split("## Keelwork-owned skills")[1]?.split("\n## ")[0] ?? "";
for (const m of ownedSection.matchAll(/^\| `([a-z0-9-]+)` \|/gm)) keelworkOwned.add(m[1]);
for (const name of keelworkOwned) {
  if (!skills.some((s) => s.name === name)) error(`FORK-CHANGES.md lists Keelwork-owned skill ${name}, which doesn't exist`);
}

// Every file that differs from the upstream baseline has a FORK-CHANGES.md row.
function blobSha(path) {
  const abs = join(repo, path);
  const st = lstatSync(abs);
  const content = st.isSymbolicLink() ? Buffer.from(readlinkSync(abs)) : readFileSync(abs);
  return createHash("sha1").update(`blob ${content.length}\0`).update(content).digest("hex");
}
const baseline = read(".agents/upstream-baseline.txt")
  .split("\n")
  .filter((l) => l && !l.startsWith("#"))
  .map((l) => l.split(" "));
// Upstream skills Keelwork renamed (FORK-CHANGES.md, "Renamed"): baseline path -> current path.
const RENAMES = [
  ["skills/engineering/ask-matt", "skills/engineering/ask-keelwork"],
  ["skills/engineering/setup-matt-pocock-skills", "skills/engineering/setup-keelwork"],
  ["docs/engineering/ask-matt.md", "docs/engineering/ask-keelwork.md"],
  ["docs/engineering/setup-matt-pocock-skills.md", "docs/engineering/setup-keelwork.md"],
  ["skills/engineering/pr", "skills/engineering/finishing-a-dev-branch"],
  ["docs/engineering/pr.md", "docs/engineering/finishing-a-dev-branch.md"],
];
const renamed = (p) => {
  for (const [from, to] of RENAMES) if (p === from || p.startsWith(`${from}/`)) return to + p.slice(from.length);
  return p;
};
const upstreamPaths = new Set();
for (const [sha, upstreamPath] of baseline) {
  const path = renamed(upstreamPath);
  upstreamPaths.add(path);
  const exists = existsSync(join(repo, path)) || (() => { try { lstatSync(join(repo, path)); return true; } catch { return false; } })();
  if (!exists) {
    if (!forkChanges.includes(`\`${path}\``)) error(`${path}: upstream file deleted with no FORK-CHANGES.md row`);
    continue;
  }
  if (blobSha(path) !== sha && !forkChanges.includes(`\`${path}\``)) {
    const symlinkTwin = path === "AGENTS.md" && forkChanges.includes("`CLAUDE.md` (and `AGENTS.md`");
    if (!symlinkTwin) error(`${path}: differs from upstream ${"v1.3.1"} but has no FORK-CHANGES.md row`);
  }
}
for (const s of skills) {
  const fromUpstream = upstreamPaths.has(`${s.rel}/SKILL.md`);
  if (!fromUpstream && !keelworkOwned.has(s.name)) error(`${s.rel}: new skill missing from FORK-CHANGES.md's Keelwork-owned skills`);
}

// Ported skills carry their source's MIT notice.
for (const s of skills) {
  if (!keelworkOwned.has(s.name)) continue;
  const ported = /Ported from|Adapted from|adapted from|draw on/.test(s.text);
  if (!ported) continue;
  const credits = join(repo, s.rel, "CREDITS.md");
  if (!existsSync(credits)) {
    error(`${s.rel}: ported skill without CREDITS.md`);
    continue;
  }
  const c = readFileSync(credits, "utf8");
  if (!/MIT License/.test(c) || !/Permission is hereby granted/.test(c) || !/Copyright \(c\)/.test(c)) {
    error(`${s.rel}/CREDITS.md: must reproduce the source's MIT copyright and permission notice`);
  }
}

// --- Docs pages ----------------------------------------------------------------

const REQUIRED_ALWAYS = ["## What it does", "## When to reach for it", "## Where it fits"];
const REQUIRED_KEELWORK = ["## Common questions", "## It's working if"];
const ORDER = ["## What it does", "## When to reach for it", "## Prerequisites", "## Common questions", "## It's working if", "## Where it fits"];
for (const s of skills.filter((x) => x.promoted)) {
  const page = `docs/${s.bucket}/${s.name}.md`;
  if (!existsSync(join(repo, page))) {
    error(`${page}: missing docs page for promoted skill ${s.name}`);
    continue;
  }
  const text = read(page);
  if (/^# /m.test(text.replace(/```[\s\S]*?```/g, ""))) error(`${page}: has an H1; pages take their title from the slug`);
  const required = keelworkOwned.has(s.name) ? [...REQUIRED_ALWAYS, ...REQUIRED_KEELWORK] : REQUIRED_ALWAYS;
  for (const h of required) if (!text.includes(`\n${h}`) && !text.startsWith(h)) error(`${page}: missing "${h}"`);
  let last = -1;
  for (const h of ORDER) {
    const i = text.indexOf(h);
    if (i < 0) continue;
    if (i < last) (keelworkOwned.has(s.name) ? error : warn)(`${page}: "${h}" is out of the template's order`);
    last = i;
  }
  if (s.name !== "ask-keelwork" && !/docs\/engineering\/ask-keelwork\.md/.test(text)) error(`${page}: "Where it fits" should point at ask-keelwork`);
}
const docsDirs = PROMOTED.map((b) => join(repo, "docs", b));
for (const dir of docsDirs) {
  for (const f of readdirSync(dir)) {
    const page = relative(repo, join(dir, f));
    const name = f.replace(/\.md$/, "");
    const text = readFileSync(join(dir, f), "utf8");
    const hasSkill = skills.some((s) => s.promoted && s.name === name);
    if (!hasSkill && !/^> \*\*Archived\.\*\*/m.test(text)) error(`${page}: no promoted skill named ${name}, and not marked archived`);
    // Links are absolute, and Keelwork links resolve to a real page.
    for (const m of text.matchAll(/\]\(([^)]+)\)/g)) {
      const url = m[1];
      if (!/^(https?:|mailto:|#)/.test(url)) error(`${page}: relative link ${url}; docs links must be absolute`);
      if (url.startsWith(KEELWORK_DOCS)) {
        const target = url.slice(KEELWORK_DOCS.length).split("#")[0];
        if (!existsSync(join(repo, "docs", target))) error(`${page}: link to missing page ${url}`);
      }
      const ai = url.match(/^https:\/\/aihero\.dev\/skills-([a-z0-9-]+)/);
      if (ai) {
        const n = ai[1];
        if (keelworkOwned.has(n)) error(`${page}: Keelwork skill ${n} linked on aihero.dev; use ${KEELWORK_DOCS}<bucket>/${n}.md`);
        else if (!existsSync(join(repo, "docs/engineering", `${n}.md`)) && !existsSync(join(repo, "docs/productivity", `${n}.md`))) {
          error(`${page}: link to unknown skill page ${url}`);
        }
      }
    }
    if (text.includes("{KW}")) error(`${page}: unexpanded {KW} placeholder`);
  }
}

// --- Prose rules ------------------------------------------------------------------

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    if ([".git", "node_modules", "results"].includes(f)) continue;
    const p = join(dir, f);
    const st = lstatSync(p);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const TEXT = /\.(md|mjs|js|sh|json|ya?ml|txt)$/;
const EM_DASH = String.fromCharCode(0x2014);
for (const abs of walk(repo)) {
  const rel = relative(repo, abs);
  if (!TEXT.test(rel) || rel === "package-lock.json" || rel === ".agents/upstream-baseline.txt") continue;
  let text = readFileSync(abs, "utf8");
  // CHANGELOG history from upstream is kept verbatim; only Keelwork's entries above it are checked.
  if (rel === "CHANGELOG.md") text = text.split("\n## 1.3.1\n")[0];
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (line.includes(EM_DASH)) error(`${rel}:${i + 1}: em-dash; rewrite the sentence (CLAUDE.md)`);
  });
}

// Brand: never "Keel" alone in product copy outside the five-layer picture.
for (const rel of ["README.md", ".claude-plugin/plugin.json", ".claude-plugin/marketplace.json", "package.json"]) {
  const text = read(rel);
  for (const m of text.matchAll(/\bKeel\b(?!work)/g)) {
    const around = text.slice(Math.max(0, m.index - 200), m.index + 200);
    if (!/Sails|Hull|Ballast|Compass|Autopilot|Guardrails|Discovery/.test(around)) error(`${rel}: "Keel" used alone outside the five-layer picture (brand rule 1)`);
  }
}

// --- N1 and N2: description budget and trigger hygiene ------------------------------

const modelInvoked = skills.filter((s) => s.promoted && !s.userInvoked);
const total = modelInvoked.reduce((n, s) => n + s.description.length, 0);
if (total > DESCRIPTION_TOTAL_CAP) error(`N1: model-invoked descriptions total ${total} chars, over the ${DESCRIPTION_TOTAL_CAP} cap`);
for (const s of modelInvoked) {
  if (keelworkOwned.has(s.name) && s.description.length > KEELWORK_DESCRIPTION_CAP) {
    error(`N1: ${s.name} description is ${s.description.length} chars, over the ${KEELWORK_DESCRIPTION_CAP} cap for Keelwork skills`);
  }
}

// Trigger phrases: the "Use when ..." / "Use before ..." clause of each description.
// Two skills sharing a four-word trigger phrase is a likely collision.
const STOP = new Set(["the", "a", "an", "or", "and", "of", "to", "for", "when", "use", "it", "is", "on", "in", "with", "user", "asks", "any", "that", "this"]);
function triggerGrams(desc) {
  const clause = (desc.match(/\b(Use|Only)\b.*$/) ?? [""])[0].toLowerCase();
  const words = clause.replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
  const grams = new Set();
  for (let i = 0; i + 4 <= words.length; i++) grams.add(words.slice(i, i + 4).join(" "));
  return grams;
}
for (let i = 0; i < modelInvoked.length; i++) {
  for (let j = i + 1; j < modelInvoked.length; j++) {
    const a = triggerGrams(modelInvoked[i].description);
    const b = triggerGrams(modelInvoked[j].description);
    const shared = [...a].filter((g) => b.has(g));
    if (shared.length) error(`N2: ${modelInvoked[i].name} and ${modelInvoked[j].name} share trigger phrase(s): ${shared.join("; ")}`);
  }
}

// --- Hooks ----------------------------------------------------------------------------

const hooks = JSON.parse(read("hooks/hooks.json"));
for (const [event, groups] of Object.entries(hooks.hooks)) {
  for (const g of groups) {
    for (const h of g.hooks) {
      const m = h.command.match(/hooks\/([a-z-]+\.sh)/);
      if (!m) error(`hooks.json ${event}: command doesn't point at a script in hooks/`);
      else if (!existsSync(join(repo, "hooks", m[1]))) error(`hooks.json ${event}: ${m[1]} is missing`);
      else if (!(statSync(join(repo, "hooks", m[1])).mode & 0o111)) error(`hooks/${m[1]} is not executable`);
    }
  }
}

// --- Report -----------------------------------------------------------------------------

console.log(`skills: ${skills.length} (${skills.filter((s) => s.promoted).length} promoted, ${keelworkOwned.size} Keelwork-owned)`);
console.log(`N1: ${modelInvoked.length} model-invoked descriptions, ${total} chars (cap ${DESCRIPTION_TOTAL_CAP}; upstream v1.3.1: 11 skills, 2152 chars)`);
for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error: ${e}`);
console.log(errors.length ? `\n${errors.length} error(s)` : "\nall checks passed");
process.exit(errors.length ? 1 : 0);
