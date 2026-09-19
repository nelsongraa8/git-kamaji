import { describe, expect, test } from "bun:test";
import { CommandExecutor } from "../../../../../../src/context/command-proxy/infrastructure/adapters/command-executor";
import type { ExecutionPlan } from "../../../../../../src/context/command-proxy/domain/value-objects/execution-plan";
import { commandProxyMother } from "../../../../../support/mothers/command-proxy.mother";

class ExecutorFake {
  executions = 0;

  constructor(private readonly exitCode: number) {}

  execute(_plan: ExecutionPlan): number {
    this.executions += 1;
    return this.exitCode;
  }
}

describe("CommandExecutor", () => {
  test("delegates Windows plans to the host executor", () => {
    const wslExecutor = new ExecutorFake(10);
    const hostExecutor = new ExecutorFake(20);
    const executor = new CommandExecutor(wslExecutor, hostExecutor);
    const windowsPlan = {
      ...commandProxyMother.plan(),
      target: "host" as const,
      distribution: undefined,
      translation: "preserve" as const,
    };

    const exitCode = executor.execute(windowsPlan);

    expect({ exitCode, wslExecutions: wslExecutor.executions }).toEqual({
      exitCode: 20,
      wslExecutions: 0,
    });
  });

  test("delegates Linux plans to the WSL executor", () => {
    const wslExecutor = new ExecutorFake(10);
    const hostExecutor = new ExecutorFake(20);
    const executor = new CommandExecutor(wslExecutor, hostExecutor);

    const exitCode = executor.execute(commandProxyMother.plan());

    expect({
      exitCode,
      wslExecutions: wslExecutor.executions,
      hostExecutions: hostExecutor.executions,
    }).toEqual({ exitCode: 10, wslExecutions: 1, hostExecutions: 0 });
  });

  test("propagates the WSL executor exit code", () => {
    const wslExecutor = new ExecutorFake(
      commandProxyMother.expected.nonZeroExitCode(),
    );
    const executor = new CommandExecutor(wslExecutor, new ExecutorFake(20));

    const exitCode = executor.execute(commandProxyMother.plan());

    expect(exitCode).toBe(commandProxyMother.expected.nonZeroExitCode());
  });
});
