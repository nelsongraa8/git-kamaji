import type { ArgumentTranslationPolicy } from "./argument-translation-policy";
import type { ExecutionMode } from "./execution-mode";
import type { ExecutionTarget } from "./execution-target";
import type { LinuxDistribution } from "./linux-distribution";
import type { Executable } from "./executable";

export class ExecutionPlan {
  constructor(
    readonly executable: Executable,
    readonly planArguments: readonly string[],
    readonly target: ExecutionTarget,
    readonly distribution: LinuxDistribution | undefined,
    readonly mode: ExecutionMode,
    readonly translation: ArgumentTranslationPolicy,
  ) {
    if (target === "linux" && !distribution) {
      throw new Error("Linux execution requires a distribution");
    }
  }
}
