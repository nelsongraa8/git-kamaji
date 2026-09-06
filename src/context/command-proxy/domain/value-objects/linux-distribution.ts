export class LinuxDistribution {
  private constructor(readonly value: string) {}

  static from(value: string): LinuxDistribution {
    if (!value) throw new Error("Linux distribution cannot be empty");
    return new LinuxDistribution(value);
  }
}
