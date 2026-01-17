import { GitBridge } from "./core/git-bridge.js";
import type { Logger } from "./services/logger.js";

/**
 * Facade: Orquestador principal (Kamaji Engine).
 */
export class KamajiEngine {
  constructor(
    private readonly distro: string,
    private readonly bridge: GitBridge,
    private readonly logger: Logger
  ) {}

  run(rawArgs: string[]): void {
    const exitCode = this.bridge.execute(rawArgs);

    this.runLogger(rawArgs, exitCode);

    process.exit(exitCode);
  }

  private runLogger(rawArgs: string[], exitCode: number): void {
    const message = `${rawArgs.join(" ")}`;
    this.logger.log(this.distro, message, exitCode);
  }
}
