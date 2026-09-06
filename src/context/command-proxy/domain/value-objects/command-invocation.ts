import type { CommandKind } from "./command-kind";
import { CommandArguments } from "./command-arguments";

export class CommandInvocation {
  private constructor(
    readonly kind: CommandKind,
    readonly commandArguments: CommandArguments,
  ) {}

  static create(
    kind: CommandKind,
    arguments_: readonly string[],
  ): CommandInvocation {
    return new CommandInvocation(kind, CommandArguments.from(arguments_));
  }
}
