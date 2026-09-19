import { describe, expect, test } from "bun:test";
import type { CommandInvocation } from "../../../../../../src/context/command-proxy/domain/value-objects/command-invocation";
import type { ProjectConfiguration } from "../../../../../../src/context/command-proxy/domain/entities/project-configuration";
import type { ExecutionPlan } from "../../../../../../src/context/command-proxy/domain/value-objects/execution-plan";
import { ExecuteCommandUseCase } from "../../../../../../src/context/command-proxy/application/use-cases/execute-command.use-case";
import { commandProxyMother } from "../../../../../support/mothers/command-proxy.mother";

class PlannerFake {
  calls = 0;

  constructor(private readonly result: ExecutionPlan) {}

  plan(
    _invocation: CommandInvocation,
    _configuration: ProjectConfiguration,
  ): ExecutionPlan {
    this.calls += 1;
    return this.result;
  }
}

class ExecutorFake {
  execute(): number {
    return commandProxyMother.expected.exitCode();
  }
}

class LoggerFake {
  log(): void {}
}

describe("ExecuteCommandUseCase planning", () => {
  test("uses GitExecutionPlanner for git invocations", () => {
    const gitPlanner = new PlannerFake(commandProxyMother.plan());
    const bashPlanner = new PlannerFake(commandProxyMother.plan());
    const shPlanner = new PlannerFake(commandProxyMother.plan());
    const useCase = new ExecuteCommandUseCase(
      new ExecutorFake(),
      new LoggerFake(),
      gitPlanner,
      bashPlanner,
      shPlanner,
    );

    useCase.execute(
      commandProxyMother.gitInvocation(),
      commandProxyMother.configuration(),
    );

    expect({
      git: gitPlanner.calls,
      bash: bashPlanner.calls,
      sh: shPlanner.calls,
    }).toEqual({
      git: 1,
      bash: 0,
      sh: 0,
    });
  });

  test("uses BashExecutionPlanner for bash invocations", () => {
    const gitPlanner = new PlannerFake(commandProxyMother.plan());
    const bashPlanner = new PlannerFake(commandProxyMother.plan());
    const shPlanner = new PlannerFake(commandProxyMother.plan());
    const useCase = new ExecuteCommandUseCase(
      new ExecutorFake(),
      new LoggerFake(),
      gitPlanner,
      bashPlanner,
      shPlanner,
    );

    useCase.execute(
      commandProxyMother.bashInvocation(),
      commandProxyMother.configuration(),
    );

    expect({
      git: gitPlanner.calls,
      bash: bashPlanner.calls,
      sh: shPlanner.calls,
    }).toEqual({
      git: 0,
      bash: 1,
      sh: 0,
    });
  });

  test("uses ShExecutionPlanner for sh invocations", () => {
    const gitPlanner = new PlannerFake(commandProxyMother.plan());
    const bashPlanner = new PlannerFake(commandProxyMother.plan());
    const shPlanner = new PlannerFake(commandProxyMother.plan());
    const useCase = new ExecuteCommandUseCase(
      new ExecutorFake(),
      new LoggerFake(),
      gitPlanner,
      bashPlanner,
      shPlanner,
    );

    useCase.execute(
      commandProxyMother.shInvocation(),
      commandProxyMother.configuration(),
    );

    expect({
      git: gitPlanner.calls,
      bash: bashPlanner.calls,
      sh: shPlanner.calls,
    }).toEqual({
      git: 0,
      bash: 0,
      sh: 1,
    });
  });
});
