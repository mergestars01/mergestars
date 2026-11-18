#!/usr/bin/env node
/**
 * MERGE V8.3: static non-destructive user preservation guard.
 * Read-only source inspection; does NOT connect to a database.
 * Run: node checks/user-preservation-preflight.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const user = read("backend/src/database/entities/user.entity.ts");
const auth = read("backend/src/modules/auth/auth.service.ts");
const museum = read("museum-site/app/chatgpt-auth.ts");
const core = read("museum-site/lib/core-client.ts");
const migrations = readdirSync(join(root, "backend/src/database/migrations"))
  .filter((name) => /\.ts$/.test(name));
const checks = [
  ["Existing CORE user UUID", /@PrimaryGeneratedColumn\('uuid'\)/.test(user)],
  ["Existing MERGE ID", /mergeId:\s*string/.test(user)],
  ["Existing founder ID", /founderId:\s*string/.test(user)],
  ["Existing Brand Line ID", /brandLineId:\s*string/.test(user)],
  ["Existing password hashes", /passwordHash:\s*string/.test(user)],
  ["Existing registration email uniqueness", /Email already registered/.test(auth)],
  ["Existing registration creates CORE member", /this\.createMember\(/.test(auth)],
  ["Museum uses platform-specific header identity", /oai-authenticated-user-id/.test(museum)],
  ["CORE identity endpoint validates bearer", /readCoreIdentity/.test(core) && /\/users\/me/.test(core)],
];
let failed = false;
for (const [label, ok] of checks) {
  process.stdout.write(`${ok ? "PASS" : "FAIL"} ${label}\n`);
  if (!ok) failed = true;
}
const dangerous = /\b(?:DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?["'`]?users\b|TRUNCATE\s+(?:TABLE\s+)?["'`]?users\b|DELETE\s+FROM\s+["'`]?users\b)/i;
for (const file of migrations) {
  const body = read("backend/src/database/migrations/" + file);
  if (dangerous.test(body)) {
    process.stderr.write(`REVIEW REQUIRED: destructive user-table statement in ${file}\n`);
    failed = true;
  }
}
process.stdout.write(`Reviewed ${migrations.length} existing migration source files.\n`);
process.stdout.write("NOTE: This is a static check only. No database records or production deployment were verified.\n");
if (failed) process.exitCode = 1;
