import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { CliTestHarness } from "./cli-test-harness";
import { runsInGithubActionsWindows } from "./ci-only";
import { e2eMother } from "./e2e.mother";

const describeE2E = runsInGithubActionsWindows ? describe : describe.skip;

describeE2E("bash.exe E2E", () => {
  let harness: CliTestHarness;

  beforeEach(() => {
    harness = new CliTestHarness();
  });

  afterEach(() => {
    harness.cleanup();
  });

  test("resuelve la distribucion predeterminada y ejecuta Bash en WSL", async () => {
    harness.createConfig(e2eMother.config.wsl());

    await harness.run("bash", e2eMother.arguments.bashCommand());

    expect(harness.readWslTrace()).toEqual([
      { args: ["-l", "-v"], cwd: harness.workingDir },
      {
        args: [
          "-d",
          "Ubuntu",
          "--",
          "bash",
          ...e2eMother.arguments.bashCommand(),
        ],
        cwd: harness.workingDir,
      },
    ]);
  });

  test("propaga el exit code del comando Bash dentro de WSL", async () => {
    harness.createConfig(e2eMother.config.wsl());

    const result = await harness.run("bash", [], {
      E2E_WSL_COMMAND_EXIT_CODE: "23",
    });

    expect(result.exitCode).toBe(23);
  });

  test("falla si WSL no puede resolver la distribucion predeterminada", async () => {
    harness.createConfig(e2eMother.config.wsl());

    const result = await harness.run("bash", [], {
      E2E_WSL_LIST_EXIT_CODE: "1",
    });

    expect({
      hasNonZeroExitCode: result.exitCode !== 0,
      commandWasExecuted: harness.readWslTrace().length > 1,
    }).toEqual({ hasNonZeroExitCode: true, commandWasExecuted: false });
  });
});
