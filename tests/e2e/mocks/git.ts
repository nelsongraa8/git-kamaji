import { writeFileSync } from "node:fs";

const tracePath = Bun.env.E2E_GIT_TRACE_FILE;
if (tracePath) {
  writeFileSync(
    tracePath,
    JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd() }),
    "utf-8",
  );
}

process.stdout.write(Bun.env.E2E_MOCK_STDOUT ?? "");
process.stderr.write(Bun.env.E2E_MOCK_STDERR ?? "");
process.exit(Number.parseInt(Bun.env.E2E_MOCK_EXIT_CODE ?? "0", 10));
