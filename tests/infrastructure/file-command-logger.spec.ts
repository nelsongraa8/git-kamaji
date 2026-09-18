import { rmSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { FileCommandLogger } from "../../src/context/command-proxy/infrastructure/adapters/file-command-logger";
import { commandProxyMother } from "../mothers/command-proxy.mother";
import { fileMother } from "../mothers/file.mother";

describe("FileCommandLogger", () => {
  test("writes distribution exit code and arguments", async () => {
    const path = fileMother.loggerEntryPath();
    rmSync(path, { force: true });

    new FileCommandLogger(path).log(
      commandProxyMother.expected.distribution(),
      commandProxyMother.expected.specialArguments(),
      commandProxyMother.expected.nonZeroExitCode(),
    );
    const content = await Bun.file(path).text();
    rmSync(path, { force: true });

    expect(content).toContain(
      `[Distro: ${commandProxyMother.expected.distribution()}] [ExitCode: ${commandProxyMother.expected.nonZeroExitCode()}] ${commandProxyMother.expected.specialArguments().join(" ")}`,
    );
  });

  test("creates the log file when it does not exist", async () => {
    const path = fileMother.loggerEntryPath();
    rmSync(path, { force: true });

    new FileCommandLogger(path).log(
      commandProxyMother.expected.distribution(),
      commandProxyMother.expected.shellArguments(),
      commandProxyMother.expected.exitCode(),
    );

    const exists = await Bun.file(path).exists();
    rmSync(path, { force: true });

    expect(exists).toBe(true);
  });

  test("appends entries without overwriting previous entries", async () => {
    const path = fileMother.loggerAppendPath();
    rmSync(path, { force: true });
    const logger = new FileCommandLogger(path);

    logger.log(
      commandProxyMother.expected.distribution(),
      commandProxyMother.expected.shellArguments(),
      commandProxyMother.expected.exitCode(),
    );
    logger.log(
      commandProxyMother.expected.distribution(),
      commandProxyMother.expected.shellArguments(),
      commandProxyMother.expected.nonZeroExitCode(),
    );
    const entries = (await Bun.file(path).text()).trim().split("\n");
    rmSync(path, { force: true });

    expect(entries).toHaveLength(2);
  });

  test("does not throw when the log file cannot be written", () => {
    const logger = new FileCommandLogger(fileMother.loggerUnwritablePath());

    expect(() =>
      logger.log(
        commandProxyMother.expected.distribution(),
        commandProxyMother.expected.shellArguments(),
        commandProxyMother.expected.exitCode(),
      ),
    ).not.toThrow();
  });
});
