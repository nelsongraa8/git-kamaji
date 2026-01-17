import { spawnSync } from "child_process";
import type { PathTranslator } from "../strategies/interfaces/translator.interface";

/**
 * Command Executor: Encapsula la lógica de ejecución del proceso hijo.
 */
export class GitBridge {
  constructor(
    private readonly distro: string,
    private readonly translator: PathTranslator
  ) {}

  execute(args: string[]): number {
    const translatedArgs = args.map((arg) => this.translator.translate(arg));

    // Importante: El CWD debe ser comprensible por Windows para que el proceso inicie
    const result = spawnSync(
      "wsl",
      ["-d", this.distro, "git", ...translatedArgs],
      {
        stdio: "inherit",
        windowsHide: true,
        cwd: process.cwd(),
      }
    );

    return result.status ?? 0;
  }
}
