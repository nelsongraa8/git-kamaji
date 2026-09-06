import { spawnSync } from "node:child_process";
import type { DefaultDistributionPort } from "../../application/ports/out/default-distribution.port";
import { LinuxDistribution } from "../../domain/value-objects/linux-distribution";

export class WslDefaultDistribution implements DefaultDistributionPort {
  resolve(): LinuxDistribution {
    const result = spawnSync("wsl", ["-l", "-v"], {
      encoding: "utf-8",
      windowsHide: true,
    });
    const output = this.normalizeOutput(result.stdout);
    const distribution = this.extractDistribution(output);

    if (result.status !== 0 || !distribution) {
      throw new Error("Unable to determine the default WSL distribution");
    }

    return LinuxDistribution.from(distribution);
  }

  private extractDistribution(output: string): string | undefined {
    const defaultLine = output
      .split(/\r?\n/)
      .map((value) => value.trim())
      .find((value) => value.startsWith("*"));

    const match = defaultLine?.match(/^\*\s+(.+?)\s+\S+\s+\d+\s*$/);
    return match?.[1]?.trim() || undefined;
  }

  private normalizeOutput(stdout: string | Buffer | null): string {
    if (stdout === null) return "";

    return stdout
      .toString()
      .replaceAll("\0", "")
      .replace(/^\uFEFF/, "");
  }
}
