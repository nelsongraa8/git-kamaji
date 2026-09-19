export class InvalidConfigFileException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidConfigFileException";
  }
}
