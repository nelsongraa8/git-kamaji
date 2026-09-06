import { ExecutionPlan } from "../value-objects/execution-plan";
import type { CommandInvocation } from "../value-objects/command-invocation";
import type { ProjectConfiguration } from "../entities/project-configuration";

export class BashExecutionPlanner {
  plan(
    invocation: CommandInvocation,
    configuration: ProjectConfiguration,
  ): ExecutionPlan {
    const policy = configuration.bash;
    return new ExecutionPlan(
      policy.executable,
      invocation.commandArguments.values,
      policy.target,
      policy.distribution,
      "direct",
      "preserve",
    );
  }
}
