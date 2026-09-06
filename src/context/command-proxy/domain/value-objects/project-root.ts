export class ProjectRoot {
  private constructor(readonly value: string) {}

  static from(value: string): ProjectRoot {
    if (!value) throw new Error("Project root cannot be empty");
    return new ProjectRoot(value);
  }
}
