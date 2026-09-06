import type { ExecutionTarget } from "./execution-target";
import type { LinuxDistribution } from "./linux-distribution";
import type { Executable } from "./executable";

export type BashExecutionPolicy = Readonly<{
  target: ExecutionTarget;
  distribution?: LinuxDistribution;
  executable: Executable;
}>;
