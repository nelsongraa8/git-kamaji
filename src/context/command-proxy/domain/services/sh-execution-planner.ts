import { ExecutionPlan } from "../value-objects/execution-plan";
import type { CommandInvocation } from "../value-objects/command-invocation";
import type { ProjectConfiguration } from "../entities/project-configuration";

export class ShExecutionPlanner {
  plan(
    invocation: CommandInvocation,
    configuration: ProjectConfiguration,
  ): ExecutionPlan {
    const policy = configuration.sh;
    return new ExecutionPlan(
      policy.executable,
      invocation.commandArguments.values,
      "linux",
      policy.distribution,
      "shell",
      policy.translation,
    );
  }
}
