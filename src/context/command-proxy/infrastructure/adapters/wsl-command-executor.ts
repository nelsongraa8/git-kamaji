import { spawnSync } from "node:child_process";
import type { CommandExecutorPort } from "../../application/ports/out/command-executor.port";
import type { ExecutionPlan } from "../../domain/value-objects/execution-plan";

export class WslCommandExecutor implements CommandExecutorPort {
  execute(plan: ExecutionPlan): number {
    const arguments_ = plan.planArguments.map((value) =>
      this.translate(value, plan),
    );
    const command =
      plan.mode === "shell"
        ? [
            "-d",
            plan.distribution!.value,
            plan.executable.value,
            "-c",
            this.quote(arguments_),
          ]
        : [
            "-d",
            plan.distribution!.value,
            "--",
            plan.executable.value,
            ...arguments_,
          ];
    const result = spawnSync("wsl", command, {
      stdio: "inherit",
      encoding: "utf-8",
      windowsHide: true,
      cwd: process.cwd(),
    });
    return result.status ?? 0;
  }

  private translate(value: string, plan: ExecutionPlan): string {
    if (plan.translation === "preserve" || !value) return value;
    const distribution = plan.distribution!.value;
    const uncPrefixes = [
      `\\\\wsl.localhost\\${distribution}`,
      `\\\\wsl$\\${distribution}`,
    ];
    for (const prefix of uncPrefixes) {
      if (value.startsWith(prefix))
        return value.replace(prefix, "").replaceAll("\\", "/");
    }
    if (/^[a-zA-Z]:\\/.test(value)) {
      if (plan.translation === "shell-aware") {
        const result = spawnSync(
          "wsl",
          ["-d", distribution, "wslpath", "-u", value],
          { encoding: "utf-8" },
        );
        if (result.status === 0) return result.stdout.trim();
      }
      return `/mnt/${value[0]!.toLowerCase()}${value.slice(2).replaceAll("\\", "/")}`;
    }
    return value;
  }

  private quote(arguments_: readonly string[]): string {
    return arguments_
      .map((value) => `"${value.replaceAll('"', '\\"')}"`)
      .join(" ");
  }
}
