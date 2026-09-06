import type { ArgumentTranslationPolicy } from "./argument-translation-policy";
import type { ExecutionMode } from "./execution-mode";
import type { ExecutionTarget } from "./execution-target";
import type { LinuxDistribution } from "./linux-distribution";
import type { Executable } from "./executable";

export type GitExecutionPolicy = Readonly<{
  target: ExecutionTarget;
  distribution?: LinuxDistribution;
  executable: Executable;
  mode: ExecutionMode;
  translation: ArgumentTranslationPolicy;
}>;
