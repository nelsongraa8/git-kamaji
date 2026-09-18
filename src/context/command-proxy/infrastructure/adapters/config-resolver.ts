import { join } from "node:path";
import type { ConfigFileReaderPort } from "../../application/ports/out/config-file-reader.port";
import type { GitKamajiConfig } from "../../domain/entities/git-kamaji-config";
import { GitKamajiConfigNormalizer } from "../mappers/git-kamaji-config.normalizer";

const CONFIG_FILENAME = ".git-kamajirc.json";

export class ConfigResolver {
  constructor(
    private readonly reader: ConfigFileReaderPort,
    private readonly normalizer: GitKamajiConfigNormalizer,
    private readonly userProfile = Bun.env.USERPROFILE,
  ) {}

  async resolve(projectRoot: string): Promise<GitKamajiConfig | null> {
    const localFile = join(projectRoot, CONFIG_FILENAME);

    if (await this.reader.exists(localFile)) {
      return this.normalizer.normalize(await this.reader.read(localFile));
    }

    if (!this.userProfile) return null;

    const globalFile = join(this.userProfile, CONFIG_FILENAME);

    if (await this.reader.exists(globalFile)) {
      return this.normalizer.normalize(await this.reader.read(globalFile));
    }

    return null;
  }
}
