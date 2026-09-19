import { spawnSync } from "node:child_process";
import type { CommandExecutorPort } from "../../application/ports/out/command-executor.port";
import type { ExecutionPlan } from "../../domain/value-objects/execution-plan";

export class HostCommandExecutor implements CommandExecutorPort {
  execute(plan: ExecutionPlan): number {
    const result = spawnSync(plan.executable.value, plan.planArguments, {
      stdio: "inherit",
      encoding: "utf-8",
      windowsHide: true,
      cwd: process.cwd(),
    });

    return result.status ?? 0;
  }
}
