import { appendFileSync } from "node:fs";

const args = process.argv.slice(2);
const tracePath = Bun.env.E2E_WSL_TRACE_FILE;

if (tracePath) {
  appendFileSync(
    tracePath,
    `${JSON.stringify({ args, cwd: process.cwd() })}\n`,
    "utf-8",
  );
}

if (args.length === 2 && args[0] === "-l" && args[1] === "-v") {
  process.stdout.write(
    Bun.env.E2E_WSL_DISTRIBUTION_OUTPUT ??
      `* ${Bun.env.E2E_WSL_DISTRIBUTION ?? "Ubuntu"} Running 2\n`,
  );
  process.exit(Number.parseInt(Bun.env.E2E_WSL_LIST_EXIT_CODE ?? "0", 10));
}

if (args[2] === "wslpath") {
  process.stdout.write(Bun.env.E2E_WSLPATH_OUTPUT ?? "/mnt/c/workspace/repo\n");
  process.exit(0);
}

process.stdout.write(Bun.env.E2E_WSL_STDOUT ?? "");
process.stderr.write(Bun.env.E2E_WSL_STDERR ?? "");
process.exit(Number.parseInt(Bun.env.E2E_WSL_COMMAND_EXIT_CODE ?? "0", 10));
