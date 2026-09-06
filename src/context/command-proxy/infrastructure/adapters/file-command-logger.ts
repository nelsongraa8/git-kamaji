import { appendFileSync } from "node:fs";
import { join } from "node:path";
import type { CommandLoggerPort } from "../../application/ports/out/command-logger.port";

export class FileCommandLogger implements CommandLoggerPort {
  constructor(private readonly filename: string) {}

  log(
    distribution: string,
    arguments_: readonly string[],
    exitCode: number,
  ): void {
    const entry = `[${new Date().toISOString()}] [Distro: ${distribution}] [ExitCode: ${exitCode}] ${arguments_.join(" ")}\n`;
    try {
      appendFileSync(join(process.cwd(), this.filename), entry);
    } catch {
      // Logging must not alter the command result.
    }
  }
}
