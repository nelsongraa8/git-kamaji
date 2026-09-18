import type { CommandExecutorPort } from "../../application/ports/out/command-executor.port";
import type { ExecutionPlan } from "../../domain/value-objects/execution-plan";

export class CommandExecutor implements CommandExecutorPort {
  constructor(
    private readonly wslExecutor: CommandExecutorPort,
    private readonly hostExecutor: CommandExecutorPort,
  ) {}

  execute(plan: ExecutionPlan): number {
    return plan.target === "host"
      ? this.hostExecutor.execute(plan)
      : this.wslExecutor.execute(plan);
  }
}
