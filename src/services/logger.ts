import { appendFileSync } from "fs";
import path from "path";

export class Logger {
  private readonly logPath: string;

  constructor(filename: string) {
    this.logPath = path.join(process.cwd(), filename);
  }

  public log(distro: string, message: string, exitCode: number): void {
    const timestamp = new Date().toISOString();

    const entry = `[${timestamp}] [Distro: ${distro}] [ExitCode: ${exitCode}] ${message}\n`;

    try {
      appendFileSync(this.logPath, entry);
    } catch (e) {
      // Silencio administrativo para no romper el flujo de Git
    }
  }
}
