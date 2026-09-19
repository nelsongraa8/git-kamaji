import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { CliTestHarness } from "./cli-test-harness";
import { runsInGithubActionsWindows } from "./ci-only";
import { e2eMother } from "./e2e.mother";

const describeE2E = runsInGithubActionsWindows ? describe : describe.skip;

describeE2E("sh.exe E2E", () => {
  let harness: CliTestHarness;

  beforeEach(() => {
    harness = new CliTestHarness();
  });

  afterEach(() => {
    harness.cleanup();
  });

  test("traduce rutas y ejecuta sh en modo shell dentro de WSL", async () => {
    harness.createConfig(e2eMother.config.wsl());

    await harness.run("sh", e2eMother.arguments.shCommand(), {
      E2E_WSLPATH_OUTPUT: "/mnt/c/workspace/repo\n",
    });

    expect(harness.readWslTrace()).toEqual([
      { args: ["-l", "-v"], cwd: harness.workingDir },
      {
        args: ["-d", "Ubuntu", "wslpath", "-u", "C:\\workspace\\repo"],
        cwd: harness.workingDir,
      },
      {
        args: [
          "-d",
          "Ubuntu",
          "sh",
          "-c",
          '"-c" "printf \\"hello\\"" "/mnt/c/workspace/repo"',
        ],
        cwd: harness.workingDir,
      },
    ]);
  });

  test("propaga el exit code del comando sh dentro de WSL", async () => {
    harness.createConfig(e2eMother.config.wsl());

    const result = await harness.run("sh", [], {
      E2E_WSL_COMMAND_EXIT_CODE: "31",
    });

    expect(result.exitCode).toBe(31);
  });
});
