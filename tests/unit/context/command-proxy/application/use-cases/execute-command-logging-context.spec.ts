import { describe, expect, test } from "bun:test";
import type { ExecutionPlan } from "../../../../../../src/context/command-proxy/domain/value-objects/execution-plan";
import { ExecuteCommandUseCase } from "../../../../../../src/context/command-proxy/application/use-cases/execute-command.use-case";
import { commandProxyMother } from "../../../../../support/mothers/command-proxy.mother";

class ExecutorFake {
  constructor(
    private readonly events: string[],
    private readonly exitCode: number,
  ) {}

  execute(_plan: ExecutionPlan): number {
    this.events.push("executor");
    return this.exitCode;
  }
}

class LoggerFake {
  distribution: string | undefined;

  constructor(private readonly events: string[]) {}

  log(
    distribution: string,
    _arguments: readonly string[],
    _exitCode: number,
  ): void {
    this.events.push("logger");
    this.distribution = distribution;
  }
}

describe("ExecuteCommandUseCase logging context", () => {
  test("logs the WSL distribution from the execution plan", () => {
    const events: string[] = [];
    const logger = new LoggerFake(events);
    const useCase = new ExecuteCommandUseCase(
      new ExecutorFake(events, commandProxyMother.expected.exitCode()),
      logger,
    );

    useCase.execute(
      commandProxyMother.gitInvocation(),
      commandProxyMother.configuration(),
    );

    expect(logger.distribution).toBe(
      commandProxyMother.expected.distribution(),
    );
  });

  test("logs host for a Windows execution plan", () => {
    const events: string[] = [];
    const logger = new LoggerFake(events);
    const useCase = new ExecuteCommandUseCase(
      new ExecutorFake(events, commandProxyMother.expected.exitCode()),
      logger,
    );

    useCase.execute(
      commandProxyMother.gitInvocation(),
      commandProxyMother.windowsConfiguration(),
    );

    expect(logger.distribution).toBe("host");
  });

  test("logs after the executor completes", () => {
    const events: string[] = [];
    const useCase = new ExecuteCommandUseCase(
      new ExecutorFake(events, commandProxyMother.expected.exitCode()),
      new LoggerFake(events),
    );

    useCase.execute(
      commandProxyMother.gitInvocation(),
      commandProxyMother.configuration(),
    );

    expect(events).toEqual(["executor", "logger"]);
  });
});
