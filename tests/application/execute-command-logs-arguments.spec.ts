import { describe, expect, test } from "bun:test";
import { ExecuteCommandUseCase } from "../../src/context/command-proxy/application/use-cases/execute-command.use-case";
import type { ExecutionPlan } from "../../src/context/command-proxy/domain/value-objects/execution-plan";
import { commandProxyMother } from "../mothers/command-proxy.mother";

class ExecutorFake {
  execute(_plan: ExecutionPlan): number {
    return 0;
  }
}

class LoggerFake {
  receivedArguments: readonly string[] | undefined;

  log(
    _distribution: string,
    arguments_: readonly string[],
    _exitCode: number,
  ): void {
    this.receivedArguments = arguments_;
  }
}

describe("ExecuteCommandUseCase logging", () => {
  test("logs the original command arguments", () => {
    const logger = new LoggerFake();
    const useCase = new ExecuteCommandUseCase(new ExecutorFake(), logger);

    useCase.execute(
      commandProxyMother.bashInvocation(),
      commandProxyMother.configuration(),
    );

    expect(logger.receivedArguments).toEqual(
      commandProxyMother.expected.shellArguments(),
    );
  });
});
