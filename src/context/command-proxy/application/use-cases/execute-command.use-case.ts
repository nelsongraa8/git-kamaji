import type { CommandExecutorPort } from "../ports/out/command-executor.port";
import type { CommandLoggerPort } from "../ports/out/command-logger.port";
import type { CommandInvocation } from "../../domain/value-objects/command-invocation";
import type { ProjectConfiguration } from "../../domain/entities/project-configuration";
import { GitExecutionPlanner } from "../../domain/services/git-execution-planner";
import { BashExecutionPlanner } from "../../domain/services/bash-execution-planner";
import { ShExecutionPlanner } from "../../domain/services/sh-execution-planner";

export class ExecuteCommandUseCase {
  constructor(
    private readonly executor: CommandExecutorPort,
    private readonly logger: CommandLoggerPort,
    private readonly gitPlanner = new GitExecutionPlanner(),
    private readonly bashPlanner = new BashExecutionPlanner(),
    private readonly shPlanner = new ShExecutionPlanner(),
  ) {}

  execute(
    invocation: CommandInvocation,
    configuration: ProjectConfiguration,
  ): number {
    const plan =
      invocation.kind === "git"
        ? this.gitPlanner.plan(invocation, configuration)
        : invocation.kind === "bash"
          ? this.bashPlanner.plan(invocation, configuration)
          : this.shPlanner.plan(invocation, configuration);
    const exitCode = this.executor.execute(plan);
    this.logger.log(
      plan.distribution?.value ?? "host",
      invocation.commandArguments.values,
      exitCode,
    );
    return exitCode;
  }
}
