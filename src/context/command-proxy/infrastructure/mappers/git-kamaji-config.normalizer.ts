import type { GitKamajiConfig } from "../../domain/entities/git-kamaji-config";
import { InvalidConfigFileException } from "../../domain/errors/invalid-config-file.exception";
import type { GitKamajiConfigMapper } from "../../application/ports/out/git-kamaji-config-mapper.port";

export class GitKamajiConfigNormalizer {
  constructor(
    private readonly mappers: readonly GitKamajiConfigMapper<unknown>[],
  ) {}

  normalize(input: unknown): GitKamajiConfig {
    const mapper = this.mappers.find((candidate) => candidate.supports(input));

    if (!mapper) {
      throw new InvalidConfigFileException(
        "Unsupported Git Kamaji configuration format",
      );
    }

    return mapper.map(input);
  }
}
