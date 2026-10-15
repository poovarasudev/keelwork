#!/usr/bin/env node
// Keelwork eval runner. Runs a suite's cases against the plugin in this repo,
// each in a throwaway copy of a fixture, through `claude -p`, and checks the
// transcript and the resulting files. See evals/README.md.
//
//   node evals/run.mjs <trigger|gate|resume|e2e|upstream-regression|all>
//        [--case <id>] [--model <model>] [--runs <n>] [--jobs <n>] [--dry-run] [--keep]

import { spawn, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const EVALS = dirname(fileURLToPath(import.meta.url));
const REPO = join(EVALS, "..");
const SUITES = ["trigger", "gate", "resume", "e2e", "upstream-regression"];

// --- Arguments -------------------------------------------------------------------

const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const flag = (name) => argv.includes(`--${name}`);
const target = argv.find((a) => !a.startsWith("--") && !argv[argv.indexOf(a) - 1]?.startsWith("--"));
if (!target || ![...SUITES, "all"].includes(target)) {
  console.error(`usage: node evals/run.mjs <${[...SUITES, "all"].join("|")}> [--case id] [--model m] [--runs n] [--jobs n] [--dry-run] [--keep]`);
  process.exit(2);
}
const MODEL = opt("model", "sonnet");
const RUNS = Number(opt("runs", "1"));
const ONLY = opt("case", null);
const DRY = flag("dry-run");
const KEEP = flag("keep");
const STAMP = new Date().toISOString().replace(/[:.]/g, "-");
const RESULTS = join(EVALS, "results", STAMP);

// --- Workspaces ---------------------------------------------------------------------

const sh = (cmd, cwd, env = {}) =>
  spawnSync("bash", ["-c", cmd], { cwd, encoding: "utf8", env: { ...process.env, EVALS, REPO, ...env } });

const NAMED_SETUPS = {
  // The seeded /ship run: spec, five detailed tickets, contract and ledger, at
  // the point just after plan approval, on the run's feature branch.
  seed_tags_run: () => [
    `cp -R "$EVALS/fixtures/runs/tags/." .`,
    `git add .scratch && git commit -qm "Spec and tickets: tags"`,
    `git switch -qc ship/2026-10-16-a-tags`,
    `sed -i.bak "s/BASE_SHA/$(git rev-parse --short HEAD)/; s/STARTED_AT/$(date +%Y-%m-%dT%H:%M%z | sed -E 's/([0-9]{2})$/:\\1/')/" .ship/2026-10-16-a/ledger.md && rm .ship/2026-10-16-a/ledger.md.bak`,
    `echo ".ship/" >> .git/info/exclude`,
  ],
  budget: (s) => [
    `sed -i.bak "s/^- Max tickets this run: .*/- Max tickets this run: ${s.tickets}/" .ship/2026-10-16-a/contract.md && rm .ship/2026-10-16-a/contract.md.bak`,
    `sed -i.bak "s/^Budget: [0-9]* tickets/Budget: ${s.tickets} tickets/" .ship/2026-10-16-a/ledger.md && rm .ship/2026-10-16-a/ledger.md.bak`,
  ],
  bare_remote: () => [`git init -q --bare "$(pwd)/../remote.git" && git remote add origin "$(pwd)/../remote.git"`],
  brownfield_setup_done: () => [`cp -R "$EVALS/fixtures/runs/brownfield-setup/." . && git add -A && git commit -qm "Agent skills setup"`],
  // Trigger runs: a work-in-progress feature branch with a React component, a
  // Python script, a ticket, a findings file, and an uncommitted change, so a
  // query about "this branch" or "my fix" has something real behind it.
  trigger_branch: () => [
    `git switch -qc feature/wip`,
    `cp -R "$EVALS/fixtures/runs/trigger-branch/." . && git add -A && git commit -qm "WIP: note list, tag report, archive ticket"`,
    `printf '\\nexport function archiveNote(path, id) {\\n  const notes = listNotes(path);\\n  return notes.find((n) => n.id === id);\\n}\\n' >> src/notes.js`,
  ],
};

function expandSetup(setup = []) {
  return setup.flatMap((s) => {
    if (typeof s === "string") return [s];
    const fn = NAMED_SETUPS[s.use];
    if (!fn) throw new Error(`unknown named setup "${s.use}"`);
    return fn(s);
  });
}

function makeWorkspace(fixture) {
  const root = mkdtempSync(join(tmpdir(), "keelwork-eval-"));
  const dir = join(root, "repo");
  mkdirSync(dir);
  if (fixture) cpSync(join(EVALS, "fixtures", fixture), dir, { recursive: true });
  const init = sh(
    `git init -q -b main && git config user.email eval@keelwork.invalid && git config user.name "Keelwork eval" && git add -A && git commit -q --allow-empty -m "Fixture"`,
    dir,
  );
  if (init.status !== 0) throw new Error(`git init failed: ${init.stderr}`);
  return dir;
}

// --- Running claude -------------------------------------------------------------------

function runClaude({ prompt, cwd, extraArgs = [], timeoutS = 600, killAfterS = null, stopOn = null, logPath }) {
  return new Promise((resolve) => {
    const args = [
      "-p", prompt,
      "--plugin-dir", REPO,
      "--setting-sources", "project",
      "--output-format", "stream-json",
      "--verbose",
      "--model", MODEL,
      ...extraArgs,
    ];
    // Long runs outlast a laptop's idle sleep; keep the machine awake on macOS.
    const [bin, binArgs] = process.platform === "darwin" ? ["caffeinate", ["-i", "claude", ...args]] : ["claude", args];
    const child = spawn(bin, binArgs, { cwd, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env } });
    const lines = [];
    let buf = "";
    let killedBy = null;
    const kill = (why) => {
      if (killedBy) return;
      killedBy = why;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 5000);
    };
    const timer = setTimeout(() => kill("timeout"), timeoutS * 1000);
    const killTimer = killAfterS ? setTimeout(() => kill("kill_after"), killAfterS * 1000) : null;
    child.stdout.on("data", (chunk) => {
      buf += chunk;
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (!line.trim()) continue;
        lines.push(line);
        if (stopOn) {
          try {
            if (stopOn(JSON.parse(line))) kill("stop_on");
          } catch {}
        }
      }
    });
    child.stderr.on("data", () => {});
    child.on("close", (code) => {
      clearTimeout(timer);
      if (killTimer) clearTimeout(killTimer);
      if (buf.trim()) lines.push(buf);
      if (logPath) writeFileSync(logPath, lines.join("\n") + "\n");
      resolve({ code, killedBy, events: lines.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean), raw: lines.join("\n") });
    });
  });
}

const normSkill = (s) => String(s ?? "").replace(/^\//, "").replace(/^keelwork:/, "");

function analyse(events, cwd) {
  const out = { skills: [], writes: [], bash: [], text: [], injected: [], sessionId: null };
  for (const e of events) {
    if (e.session_id && !out.sessionId) out.sessionId = e.session_id;
    const content = e.message?.content;
    if (!Array.isArray(content)) continue;
    for (const c of content) {
      if (e.type === "assistant" && c.type === "tool_use") {
        const input = c.input ?? {};
        if (c.name === "Skill") out.skills.push(normSkill(input.skill ?? input.command ?? input.name));
        if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(c.name)) {
          const p = input.file_path ?? input.notebook_path ?? "";
          out.writes.push(p.startsWith(cwd) ? relative(cwd, p) : p);
        }
        if (c.name === "Bash") {
          const cmd = String(input.command ?? "");
          out.bash.push(cmd);
          // Files a shell command writes: redirections, tee, and Python/Node scripts opening a path.
          const shellWrites = [
            ...cmd.matchAll(/(?:^|[^>&0-9])>>?\s*([\w./@-]+\.[\w]+)/g),
            ...cmd.matchAll(/\btee(?:\s+-a)?\s+([\w./@-]+)/g),
            ...cmd.matchAll(/\b(?:p|path|f|file)\s*=\s*['"]([\w./@-]+\.[\w]+)['"]/g),
            ...cmd.matchAll(/(?:writeFileSync|open)\(\s*['"]([\w./@-]+\.[\w]+)['"]/g),
          ].map((m) => m[1]);
          for (const p of shellWrites) out.writes.push(p.startsWith(cwd) ? relative(cwd, p) : p.replace(/^\.\//, ""));
        }
      }
      if (e.type === "assistant" && c.type === "text") out.text.push(c.text);
      if (e.type === "user" && c.type === "text") out.injected.push(c.text);
    }
  }
  return out;
}

// --- Checks ---------------------------------------------------------------------------

const rx = (s) => {
  const m = s.match(/^\(\?([a-z]+)\)/);
  return m ? new RegExp(s.slice(m[0].length), m[1].replace(/[^gimsuy]/g, "")) : new RegExp(s);
};
function globFiles(cwd, pattern) {
  const parts = pattern.split("/");
  let paths = [""];
  for (const part of parts) {
    const next = [];
    for (const base of paths) {
      const dir = join(cwd, base);
      if (!existsSync(dir)) continue;
      if (part.includes("*")) {
        const re = new RegExp(`^${part.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
        try { for (const f of readdirSync(dir)) if (re.test(f)) next.push(join(base, f)); } catch {}
      } else if (existsSync(join(dir, part))) next.push(join(base, part));
    }
    paths = next;
  }
  return paths;
}
const readIn = (cwd, p) => {
  const [f] = globFiles(cwd, p);
  return f ? readFileSync(join(cwd, f), "utf8") : null;
};

function check(expect, ctx) {
  const fails = [];
  const { a, cwd, raw, before } = ctx;
  const fail = (m) => fails.push(m);
  for (const s of expect.skills_fired ?? []) if (!a.skills.includes(s)) fail(`skill ${s} never fired (fired: ${[...new Set(a.skills)].join(", ") || "none"})`);
  for (const s of expect.skills_not_fired ?? []) if (a.skills.includes(s)) fail(`skill ${s} fired`);
  for (const [x, y] of expect.order ?? []) {
    const i = a.skills.indexOf(x), j = a.skills.indexOf(y);
    if (i < 0 || j < 0 || i > j) fail(`expected ${x} before ${y}`);
  }
  for (const p of expect.files_exist ?? []) if (!globFiles(cwd, p).length) fail(`missing ${p}`);
  for (const p of expect.files_absent ?? []) if (globFiles(cwd, p).length) fail(`unexpected ${p}`);
  for (const { path, regex } of expect.file_matches ?? []) {
    const t = readIn(cwd, path);
    if (t === null) fail(`missing ${path}`);
    else if (!rx(regex).test(t)) fail(`${path} doesn't match /${regex}/`);
  }
  for (const { path, regex } of expect.file_not_matches ?? []) {
    const t = readIn(cwd, path);
    if (t !== null && rx(regex).test(t)) fail(`${path} matches /${regex}/`);
  }
  for (const { path, first, then } of expect.file_order ?? []) {
    const t = readIn(cwd, path) ?? "";
    const i = t.indexOf(first), j = t.indexOf(then);
    if (i < 0) fail(`${path}: "${first}" not found`);
    else if (j >= 0 && j < i) fail(`${path}: "${then}" appears before "${first}"`);
  }
  const text = a.text.join("\n");
  for (const r of expect.transcript_matches ?? []) if (!rx(r).test(text)) fail(`transcript doesn't match /${r}/`);
  for (const r of expect.transcript_not_matches ?? []) if (rx(r).test(text)) fail(`transcript matches /${r}/`);
  for (const r of expect.stream_matches ?? []) if (!rx(r).test(raw)) fail(`stream doesn't match /${r}/`);
  for (const r of expect.stream_not_matches ?? []) if (rx(r).test(raw)) fail(`stream matches /${r}/`);
  for (const r of expect.no_writes_matching ?? []) {
    const hit = a.writes.find((w) => rx(r).test(w));
    if (hit) fail(`wrote ${hit}`);
  }
  for (const r of expect.no_bash_matching ?? []) {
    const hit = a.bash.find((c) => rx(r).test(c));
    if (hit) fail(`ran forbidden command: ${hit}`);
  }
  for (const { first, before: second } of expect.write_order ?? []) {
    const i = a.writes.findIndex((w) => rx(first).test(w));
    const j = a.writes.findIndex((w) => rx(second).test(w));
    if (i < 0) fail(`no write matching ${first}`);
    else if (j >= 0 && j < i) fail(`wrote ${a.writes[j]} before any ${first}`);
  }
  for (const { run, exit } of expect.commands ?? []) {
    const r = sh(run, cwd);
    if (r.status !== exit) fail(`\`${run}\` exited ${r.status}, expected ${exit}`);
  }
  for (const { regex, max, min } of expect.commit_counts ?? []) {
    const log = sh(`git log --all --format=%s`, cwd).stdout.split("\n");
    const n = log.filter((l) => rx(regex).test(l)).length;
    if (max !== undefined && n > max) fail(`${n} commits match /${regex}/, max ${max}`);
    if (min !== undefined && n < min) fail(`${n} commits match /${regex}/, min ${min}`);
  }
  const g = expect.git ?? {};
  if (g.main_unchanged && sh(`git rev-parse main`, cwd).stdout.trim() !== before.main) fail(`main moved`);
  if (g.no_new_commits && sh(`git rev-list --all --count`, cwd).stdout.trim() !== before.commits) fail(`new commits were made`);
  if (g.remote_has_branch) {
    const r = sh(`git ls-remote --heads origin ${g.remote_has_branch}`, cwd);
    if (!r.stdout.trim()) fail(`remote has no branch ${g.remote_has_branch}`);
  }
  return fails;
}

// --- Suites ----------------------------------------------------------------------------

function loadSuite(name) {
  const data = JSON.parse(readFileSync(join(EVALS, "suites", `${name}.json`), "utf8"));
  return name === "trigger" ? { suite: name, cases: data } : data;
}

function validate(name, suite) {
  const problems = [];
  for (const c of suite.cases) {
    if (name === "trigger") {
      if (typeof c.query !== "string" || typeof c.should_trigger !== "boolean" || !c.skill) problems.push(`trigger case malformed: ${JSON.stringify(c)}`);
      else if (!existsSync(join(REPO, "skills/engineering", c.skill)) && !existsSync(join(REPO, "skills/productivity", c.skill))) problems.push(`trigger case names unknown skill ${c.skill}`);
      continue;
    }
    if (!c.id || !Array.isArray(c.steps) || !c.expect) problems.push(`${name}: case malformed: ${c.id}`);
    if (c.fixture && !existsSync(join(EVALS, "fixtures", c.fixture))) problems.push(`${c.id}: unknown fixture ${c.fixture}`);
    try { expandSetup(c.setup); } catch (e) { problems.push(`${c.id}: ${e.message}`); }
    for (const r of [...(c.expect.transcript_matches ?? []), ...(c.expect.stream_matches ?? [])]) {
      try { rx(r); } catch { problems.push(`${c.id}: bad regex ${r}`); }
    }
  }
  return problems;
}

async function runTriggerCase(c, i) {
  const fires = [];
  const accepted = [c.skill, ...(c.accept_via ?? [])];
  for (let r = 0; r < RUNS; r++) {
    const cwd = makeWorkspace("greenfield");
    for (const cmd of expandSetup(c.setup ?? [{ use: "trigger_branch" }])) {
      const s = sh(cmd, cwd);
      if (s.status !== 0) return { id: `${c.skill}: ${c.query.slice(0, 60)}`, pass: false, detail: `setup failed: ${cmd}\n${s.stderr}` };
    }
    const res = await runClaude({
      prompt: c.query,
      cwd,
      timeoutS: 120,
      // A throwaway workspace, so tools stay enabled: a model that can't run the
      // tests has no reason to reach for a skill that runs them.
      extraArgs: ["--permission-mode", "bypassPermissions"],
      stopOn: (e) => e.type === "assistant" && (e.message?.content ?? []).some((x) => x.type === "tool_use" && x.name === "Skill"),
      logPath: join(RESULTS, "trigger", `${String(i).padStart(2, "0")}-${c.skill}-${r}.jsonl`),
    });
    fires.push(analyse(res.events, cwd).skills.some((k) => accepted.includes(k)));
  }
  const rate = fires.filter(Boolean).length / fires.length;
  const pass = c.should_trigger ? rate >= 0.5 : rate < 0.5;
  return { id: `${c.skill}: ${c.query.slice(0, 60)}`, pass, detail: `trigger rate ${rate.toFixed(2)} (want ${c.should_trigger ? "fire" : "no fire"})` };
}

async function runCase(suiteName, c) {
  const cwd = makeWorkspace(c.fixture);
  for (const cmd of expandSetup(c.setup)) {
    const r = sh(cmd, cwd);
    if (r.status !== 0) return { id: c.id, pass: false, detail: `setup failed: ${cmd}\n${r.stderr}` };
  }
  const before = {
    main: sh(`git rev-parse main`, cwd).stdout.trim(),
    commits: sh(`git rev-list --all --count`, cwd).stdout.trim(),
  };
  const caseDir = join(RESULTS, suiteName, c.id);
  mkdirSync(caseDir, { recursive: true });
  const all = { skills: [], writes: [], bash: [], text: [], injected: [] };
  let raw = "";
  let sessionId = null;
  for (const [i, step] of c.steps.entries()) {
    const extraArgs = ["--permission-mode", "bypassPermissions"];
    if (sessionId && !step.new_session) extraArgs.push("--resume", sessionId);
    const res = await runClaude({
      prompt: step.prompt,
      cwd,
      timeoutS: step.timeout_s ?? 600,
      killAfterS: step.kill_after_s ?? null,
      extraArgs,
      logPath: join(caseDir, `step-${i + 1}.jsonl`),
    });
    const a = analyse(res.events, cwd);
    sessionId = a.sessionId ?? sessionId;
    for (const k of Object.keys(all)) all[k].push(...a[k]);
    raw += res.raw + "\n";
    if (res.killedBy === "timeout") all.text.push(`[step ${i + 1} timed out]`);
  }
  const fails = check(c.expect, { a: all, cwd, raw, before });
  const result = { id: c.id, pass: fails.length === 0, detail: fails.join("; ") || "ok", workspace: KEEP ? cwd : undefined };
  writeFileSync(join(caseDir, "result.json"), JSON.stringify({ ...result, skills: all.skills, writes: all.writes }, null, 2));
  return result;
}

async function pool(items, jobs, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(jobs, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

// --- Main ----------------------------------------------------------------------------------

const names = target === "all" ? SUITES : [target];
let failed = 0;
let problems = 0;
for (const name of names) {
  const suite = loadSuite(name);
  const issues = validate(name, suite);
  for (const p of issues) console.log(`invalid: ${p}`);
  problems += issues.length;
  const cases = suite.cases.filter((c) => !ONLY || c.id === ONLY || c.skill === ONLY);
  if (DRY) {
    console.log(`${name}: ${cases.length} case(s) valid${issues.length ? " (with problems above)" : ""}`);
    continue;
  }
  mkdirSync(join(RESULTS, name), { recursive: true });
  const jobs = Number(opt("jobs", name === "trigger" ? "4" : "1"));
  const results = await pool(cases, jobs, (c, i) => (name === "trigger" ? runTriggerCase(c, i) : runCase(name, c)));
  console.log(`\n${name}`);
  for (const r of results) {
    console.log(`  ${r.pass ? "pass" : "FAIL"}  ${r.id}${r.pass ? "" : `\n        ${r.detail}`}${r.workspace ? `\n        workspace: ${r.workspace}` : ""}`);
    if (!r.pass) failed++;
  }
  writeFileSync(join(RESULTS, name, "summary.json"), JSON.stringify(results, null, 2));
}
if (!DRY) console.log(`\nresults: ${relative(process.cwd(), RESULTS)}`);
process.exit(failed || problems ? 1 : 0);
