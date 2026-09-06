export class Executable {
  private constructor(readonly value: string) {}

  static from(value: string): Executable {
    if (!value) throw new Error("Executable cannot be empty");
    return new Executable(value);
  }
}
