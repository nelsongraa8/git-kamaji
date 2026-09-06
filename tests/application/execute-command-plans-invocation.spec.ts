import { describe, expect, test } from "bun:test";
import { ExecuteCommandUseCase } from "../../src/context/command-proxy/application/use-cases/execute-command.use-case";
import type { ExecutionPlan } from "../../src/context/command-proxy/domain/value-objects/execution-plan";
import { commandProxyMother } from "../mothers/command-proxy.mother";

class ExecutorFake {
  receivedPlan: ExecutionPlan | undefined;

  execute(plan: ExecutionPlan): number {
    this.receivedPlan = plan;
    return 0;
  }
}

class LoggerFake {
  log(): void {}
}

describe("ExecuteCommandUseCase planning", () => {
  test("plans the command according to its kind", () => {
    const executor = new ExecutorFake();
    const useCase = new ExecuteCommandUseCase(executor, new LoggerFake());

    useCase.execute(
      commandProxyMother.shInvocation(),
      commandProxyMother.configuration(),
    );

    expect(executor.receivedPlan?.mode).toBe("shell");
  });
});
