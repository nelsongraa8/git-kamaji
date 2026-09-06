import { spawnSync } from "node:child_process";
import type { DefaultDistributionPort } from "../../application/ports/out/default-distribution.port";
import { LinuxDistribution } from "../../domain/value-objects/linux-distribution";
import { WslDistributionOutputMapper } from "../mappers/wsl-distribution-output.mapper";

export class WslDefaultDistribution implements DefaultDistributionPort {
  constructor(
    private readonly outputMapper = new WslDistributionOutputMapper(),
  ) {}

  resolve(): LinuxDistribution {
    const result = spawnSync("wsl", ["-l", "-v"], {
      encoding: "utf-8",
      windowsHide: true,
    });
    const distribution = this.outputMapper.map(result.stdout);

    if (result.status !== 0 || !distribution) {
      throw new Error("Unable to determine the default WSL distribution");
    }

    return LinuxDistribution.from(distribution);
  }
}
