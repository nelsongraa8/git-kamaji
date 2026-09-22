import { join, win32 } from "node:path";
import type { ConfigFileReaderPort } from "../../application/ports/out/config-file-reader.port";
import type { GitKamajiConfig } from "../../domain/entities/git-kamaji-config";
import { GitKamajiConfigNormalizer } from "../mappers/git-kamaji-config.normalizer";

const CONFIG_FILENAME = ".git-kamajirc.json";
const DEFAULT_GLOBAL_CONFIG_ROOT = Bun.env.USERPROFILE
  ? win32.join(Bun.env.USERPROFILE, ".gitkamaji")
  : undefined;

const joinConfigPath = (root: string): string =>
  root.startsWith("\\\\") || /^[a-zA-Z]:[\\/]/.test(root)
    ? win32.join(root, CONFIG_FILENAME)
    : join(root, CONFIG_FILENAME);

export class ConfigResolver {
  constructor(
    private readonly reader: ConfigFileReaderPort,
    private readonly normalizer: GitKamajiConfigNormalizer,
    private readonly userProfile = DEFAULT_GLOBAL_CONFIG_ROOT,
  ) {}

  async resolve(projectRoot: string): Promise<GitKamajiConfig | null> {
    const localFile = joinConfigPath(projectRoot);

    if (await this.reader.exists(localFile)) {
      return this.normalizer.normalize(await this.reader.read(localFile));
    }

    if (!this.userProfile) return null;

    const globalFile = joinConfigPath(this.userProfile);

    if (await this.reader.exists(globalFile)) {
      return this.normalizer.normalize(await this.reader.read(globalFile));
    }

    return null;
  }
}
