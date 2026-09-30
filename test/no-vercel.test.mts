import assert from "node:assert";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Frifti runs on Helm7, not Vercel. Anything that names Vercel either does nothing there
// (the analytics packages only report when served through Vercel's edge) or silently changes
// behaviour (a Sentry environment read from VERCEL_ENV would label every production error
// "development"). Keep them out.
//
// Files marked GENERATED are copies of shared service clients whose canonical source is
// edited elsewhere, so they are not policed here.

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

const ROOTS = ["app", "components", "lib"];
const TOP_LEVEL = ["next.config.ts", "middleware.ts", "instrumentation.ts", "instrumentation-client.ts", "sentry.server.config.ts", "sentry.edge.config.ts"];

function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) sourceFiles(p, found);
    else if (/\.(ts|tsx|mjs)$/.test(entry)) found.push(p);
  }
  return found;
}

const files = [...ROOTS.flatMap((r) => sourceFiles(r)), ...TOP_LEVEL.filter(existsSync)].filter(
  (f) => !/GENERATED/.test(readFileSync(f, "utf8").slice(0, 400)),
);
const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

test("finds the source to police", () => {
  assert.ok(files.length > 40, `only ${files.length} source files found; the roots are wrong`);
});

test("names Vercel nowhere in application code", () => {
  const offenders = files.filter((f) => /vercel/i.test(readFileSync(f, "utf8")));
  assert.deepStrictEqual(offenders, [], `These mention Vercel: ${offenders.join(", ")}`);
});

test("has no Vercel package, CLI script or vercel.json", () => {
  const packages = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter(
    (n) => n === "vercel" || n.startsWith("@vercel/"),
  );
  assert.deepStrictEqual(packages, []);
  const scripts = Object.entries(pkg.scripts ?? {}).filter(([, cmd]) => /\bvercel\b/.test(cmd));
  assert.deepStrictEqual(scripts, []);
  assert.strictEqual(existsSync("vercel.json"), false);
});

test("starts on the port Helm7 assigns", () => {
  // Helm7 runs `npm start` with PORT set; a hard-coded port leaves the health check
  // probing an address nothing listens on.
  assert.ok(pkg.scripts?.start?.includes("${PORT"), "npm start must read $PORT");
});

console.log(`no-vercel: ${passed} passed`);
