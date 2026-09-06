import type { ArgumentTranslationPolicy } from "./argument-translation-policy";
import type { LinuxDistribution } from "./linux-distribution";
import type { Executable } from "./executable";

export type ShExecutionPolicy = Readonly<{
  distribution: LinuxDistribution;
  executable: Executable;
  translation: ArgumentTranslationPolicy;
}>;
