import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The funniest commit message after breaking production at 3 AM.
// It has to read like a real commit: conventional-commit scope,
// a terse imperative, and the weary honesty of someone who knows
// the rollback is also broken. The joke stacks three failures in
// one breath — the break, the rollback that broke the rollback,
// and the fix for the fix — then begs the reviewer not to look at
// the diff, which is exactly what a 3 AM author would do.
const LINE =
  "fix(prod): I broke it at 3am and the rollback broke the rollback — deploying the fix for the fix now, please don't look at the diff";

// The gate requires 1-200 UTF-8 characters, not only whitespace.
if (LINE.length < 1 || LINE.length > 200 || LINE.trim().length === 0) {
  throw new Error(`entry line must be 1-200 chars, got ${LINE.length}`);
}

// Write to the ABSOLUTE /output/entry.txt at the filesystem root,
// as the competition rules require. The sealed scorer reads
// /output/entry.txt, wherever main.ts is invoked from.
const outDir = "/output";
const outFile = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");

// Self-check: read back what was written and confirm it is exactly
// the line, so a silent write failure can never pass as success.
const written = readFileSync(outFile, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt content does not match the entry line");
}
