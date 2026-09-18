import { rmSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import {
  commandLoggerFrom,
  configurationFrom,
  requiresDefaultDistribution,
} from "../src/app/entrypoints/configuration";
import { FileCommandLogger } from "../src/context/command-proxy/infrastructure/adapters/file-command-logger";
import { NoopCommandLogger } from "../src/context/command-proxy/infrastructure/adapters/noop-command-logger";
import { GitExecutionPlanner } from "../src/context/command-proxy/domain/services/git-execution-planner";
import { commandProxyMother } from "./mothers/command-proxy.mother";
import { gitKamajiConfigMother } from "./mothers/git-kamaji-config.mother";

describe("Git configuration composition", () => {
  test("does not require a WSL distribution for a Windows target", () => {
    const config = gitKamajiConfigMother.windows();

    expect(requiresDefaultDistribution(config)).toBe(false);
  });

  test("creates a host plan without translating Windows paths", () => {
    const config = configurationFrom(gitKamajiConfigMother.windows());
    const plan = new GitExecutionPlanner().plan(
      commandProxyMother.gitInvocation(["C:\\workspace\\repo"]),
      config,
    );

    expect({
      target: plan.target,
      translation: plan.translation,
      distribution: plan.distribution,
    }).toEqual({
      target: "host",
      translation: "preserve",
      distribution: undefined,
    });
  });

  test("composes a Windows configuration with its custom executable", () => {
    const config = configurationFrom(
      gitKamajiConfigMother.windowsWithExecutable(),
    );

    expect({
      target: config.git.target,
      executable: config.git.executable.value,
      translation: config.git.translation,
      distribution: config.git.distribution,
    }).toEqual({
      target: "host",
      executable: "custom-git.exe",
      translation: "preserve",
      distribution: undefined,
    });
  });

  test("composes an explicit WSL configuration", () => {
    const config = configurationFrom(gitKamajiConfigMother.wsl("Debian"));

    expect({
      target: config.git.target,
      executable: config.git.executable.value,
      distribution: config.git.distribution?.value,
      translation: config.git.translation,
    }).toEqual({
      target: "linux",
      executable: "git",
      distribution: "Debian",
      translation: "windows-to-linux",
    });
  });

  test("uses the default WSL distribution when the configuration omits it", () => {
    const config = configurationFrom(
      gitKamajiConfigMother.wslWithoutDistribution(),
      commandProxyMother.distribution(),
    );

    expect(config.git.distribution).toBe(commandProxyMother.distribution());
  });

  test("rejects WSL configuration without an explicit or default distribution", () => {
    expect(() =>
      configurationFrom(gitKamajiConfigMother.wslWithoutDistribution()),
    ).toThrow("WSL configuration requires a distribution");
  });

  test("uses defaults when configuration is missing", () => {
    const config = configurationFrom(null, commandProxyMother.distribution());

    expect({
      target: config.git.target,
      executable: config.git.executable.value,
      distribution: config.git.distribution,
      translation: config.git.translation,
    }).toEqual({
      target: "linux",
      executable: "git",
      distribution: commandProxyMother.distribution(),
      translation: "windows-to-linux",
    });
  });

  test("requires a default distribution for missing configuration", () => {
    expect(requiresDefaultDistribution(null)).toBe(true);
  });

  test("does not require a default distribution for Windows configuration", () => {
    expect(requiresDefaultDistribution(gitKamajiConfigMother.windows())).toBe(
      false,
    );
  });

  test("does not require a default distribution for explicit WSL configuration", () => {
    expect(requiresDefaultDistribution(gitKamajiConfigMother.wsl())).toBe(
      false,
    );
  });

  test("requires a default distribution for implicit WSL configuration", () => {
    expect(
      requiresDefaultDistribution(
        gitKamajiConfigMother.wslWithoutDistribution(),
      ),
    ).toBe(true);
  });

  test("creates a file logger when logging is enabled", () => {
    expect(commandLoggerFrom(gitKamajiConfigMother.wsl())).toBeInstanceOf(
      FileCommandLogger,
    );
  });

  test("creates a no-op logger when logging is disabled", () => {
    expect(commandLoggerFrom(gitKamajiConfigMother.windows())).toBeInstanceOf(
      NoopCommandLogger,
    );
  });

  test("uses the configured logging file", async () => {
    const filename = "configuration-custom.log";
    const logger = commandLoggerFrom(
      gitKamajiConfigMother.windowsWithLoggingFile(filename),
    );

    logger.log(
      commandProxyMother.expected.distribution(),
      commandProxyMother.expected.shellArguments(),
      commandProxyMother.expected.exitCode(),
    );

    expect(await Bun.file(filename).exists()).toBe(true);
    rmSync(filename, { force: true });
  });
});
