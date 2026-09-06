export class CommandArguments {
  private constructor(readonly values: readonly string[]) {}

  static from(values: readonly string[]): CommandArguments {
    return new CommandArguments([...values]);
  }
}
