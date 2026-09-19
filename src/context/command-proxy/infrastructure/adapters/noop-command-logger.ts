import type { CommandLoggerPort } from "../../application/ports/out/command-logger.port";

export class NoopCommandLogger implements CommandLoggerPort {
  log(): void {}
}
