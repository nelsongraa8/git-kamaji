import type { BashExecutionPolicy } from "../value-objects/bash-execution-policy";
import type { GitExecutionPolicy } from "../value-objects/git-execution-policy";
import type { ProjectRoot } from "../value-objects/project-root";
import type { ShExecutionPolicy } from "../value-objects/sh-execution-policy";

export class ProjectConfiguration {
  constructor(
    readonly projectRoot: ProjectRoot,
    readonly git: GitExecutionPolicy,
    readonly bash: BashExecutionPolicy,
    readonly sh: ShExecutionPolicy,
  ) {}
}
