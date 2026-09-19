import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { CliTestHarness } from "./cli-test-harness";
import { runsInGithubActionsWindows } from "./ci-only";
import { e2eMother } from "./e2e.mother";

const describeE2E = runsInGithubActionsWindows ? describe : describe.skip;

describeE2E("git.exe E2E", () => {
  let harness: CliTestHarness;

  beforeEach(() => {
    harness = new CliTestHarness();
  });

  afterEach(() => {
    harness.cleanup();
  });

  test("reenvia los argumentos al ejecutable Git externo", async () => {
    harness.createConfig(e2eMother.config.windows(harness.mockGitExecutable()));

    const result = await harness.run("git", e2eMother.arguments.gitStatus());

    expect(harness.readGitTrace()).toEqual({
      args: e2eMother.arguments.gitStatus(),
      cwd: harness.workingDir,
    });
  });

  test("usa la configuracion global cuando el proyecto no tiene configuracion local", async () => {
    harness.createGlobalConfig(
      e2eMother.config.windows(harness.mockGitExecutable()),
    );

    await harness.run("git", e2eMother.arguments.gitStatus());

    expect(harness.readGitTrace()).toEqual({
      args: e2eMother.arguments.gitStatus(),
      cwd: harness.workingDir,
    });
  });

  test("prefiere la configuracion local sobre la configuracion global", async () => {
    harness.createGlobalConfig(
      e2eMother.config.windows("global-git-that-must-not-run.exe"),
    );
    harness.createConfig(e2eMother.config.windows(harness.mockGitExecutable()));

    await harness.run("git", e2eMother.arguments.gitStatus());

    expect(harness.readGitTrace()).toEqual({
      args: e2eMother.arguments.gitStatus(),
      cwd: harness.workingDir,
    });
  });

  test("permite que el proyecto local cambie de WSL global a Git de Windows", async () => {
    harness.createGlobalConfig(e2eMother.config.wsl());
    harness.createConfig(e2eMother.config.windows(harness.mockGitExecutable()));

    await harness.run("git", e2eMother.arguments.gitStatus());

    expect({
      git: harness.readGitTrace(),
      wsl: harness.readWslTrace(),
    }).toEqual({
      git: {
        args: e2eMother.arguments.gitStatus(),
        cwd: harness.workingDir,
      },
      wsl: [],
    });
  });

  test("permite que el proyecto local cambie de Windows global a Git en WSL", async () => {
    harness.createGlobalConfig(
      e2eMother.config.windows("global-git-that-must-not-run.exe"),
    );
    harness.createConfig(e2eMother.config.wsl());

    await harness.run("git", e2eMother.arguments.gitStatus());

    expect({
      git: harness.readGitTrace(),
      wsl: harness.readWslTrace(),
    }).toEqual({
      git: undefined,
      wsl: [
        {
          args: [
            "-d",
            "Ubuntu",
            "--",
            "git",
            ...e2eMother.arguments.gitStatus(),
          ],
          cwd: harness.workingDir,
        },
      ],
    });
  });

  test("propaga stdout, stderr y exit code del ejecutable Git", async () => {
    harness.createConfig(e2eMother.config.windows(harness.mockGitExecutable()));

    const result = await harness.run("git", [], {
      E2E_MOCK_STDOUT: "mock stdout",
      E2E_MOCK_STDERR: "mock stderr",
      E2E_MOCK_EXIT_CODE: "17",
    });

    expect({
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr,
    }).toEqual({ exitCode: 17, stdout: "mock stdout", stderr: "mock stderr" });
  });

  test("ejecuta Git dentro de la distribucion WSL configurada", async () => {
    harness.createConfig(e2eMother.config.wsl());

    await harness.run("git", e2eMother.arguments.gitStatus());

    expect(harness.readWslTrace()).toEqual([
      {
        args: ["-d", "Ubuntu", "--", "git", ...e2eMother.arguments.gitStatus()],
        cwd: harness.workingDir,
      },
    ]);
  });

  test("escribe el log real con los argumentos y exit code del comando", async () => {
    harness.createConfig(
      e2eMother.config.windows(harness.mockGitExecutable(), true),
    );

    await harness.run("git", e2eMother.arguments.gitStatus(), {
      E2E_MOCK_EXIT_CODE: "9",
    });

    const log = await Bun.file(harness.logPath("gitkamaji.log")).text();

    expect({
      containsArguments: log.includes("status --porcelain"),
      containsExitCode: log.includes("[ExitCode: 9]"),
    }).toEqual({ containsArguments: true, containsExitCode: true });
  });

  test("rechaza JSON corrupto sin invocar al ejecutable externo", async () => {
    harness.createConfig("{ invalid json syntax ");

    const result = await harness.run("git", e2eMother.arguments.gitStatus());

    expect({
      hasNonZeroExitCode: result.exitCode !== 0,
      gitWasInvoked: harness.readGitTrace() !== undefined,
    }).toEqual({ hasNonZeroExitCode: true, gitWasInvoked: false });
  });

  test("no crea log cuando el logging esta deshabilitado", async () => {
    harness.createConfig(e2eMother.config.windows(harness.mockGitExecutable()));

    await harness.run("git");

    expect(await Bun.file(harness.logPath("gitkamaji.log")).exists()).toBe(
      false,
    );
  });
});
