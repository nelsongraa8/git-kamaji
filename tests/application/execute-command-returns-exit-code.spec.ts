import { describe, expect, test } from "bun:test";
import { ExecuteCommandUseCase } from "../../src/context/command-proxy/application/use-cases/execute-command.use-case";
import { commandProxyMother } from "../mothers/command-proxy.mother";

class ExecutorFake {
  constructor(private readonly exitCode: number) {}

  execute(): number {
    return this.exitCode;
  }
}

class LoggerFake {
  log(): void {}
}

describe("ExecuteCommandUseCase exit code", () => {
  test("returns the executor exit code", () => {
    const useCase = new ExecuteCommandUseCase(
      new ExecutorFake(commandProxyMother.expected.nonZeroExitCode()),
      new LoggerFake(),
    );

    const actual = useCase.execute(
      commandProxyMother.gitInvocation(),
      commandProxyMother.configuration(),
    );

    expect(actual).toBe(commandProxyMother.expected.nonZeroExitCode());
  });
});
