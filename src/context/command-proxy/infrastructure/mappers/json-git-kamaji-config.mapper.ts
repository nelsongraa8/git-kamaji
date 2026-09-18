import type { GitKamajiConfig } from "../../domain/entities/git-kamaji-config";
import { InvalidConfigFileException } from "../../domain/errors/invalid-config-file.exception";
import type { GitKamajiConfigMapper } from "../../application/ports/out/git-kamaji-config-mapper.port";

type JsonObject = Record<string, unknown>;

export class JsonGitKamajiConfigMapper implements GitKamajiConfigMapper<unknown> {
  supports(input: unknown): boolean {
    return isObject(input) && "target" in input && "logging" in input;
  }

  map(input: unknown): GitKamajiConfig {
    if (!isObject(input) || !this.supports(input)) {
      throw new InvalidConfigFileException(
        "Invalid Git Kamaji configuration structure",
      );
    }

    return {
      target: this.mapTarget(input.target),
      logging: this.mapLogging(input.logging),
    };
  }

  private mapTarget(input: unknown): GitKamajiConfig["target"] {
    if (
      !isObject(input) ||
      (input.type !== "windows" && input.type !== "wsl")
    ) {
      throw new InvalidConfigFileException("Invalid Git Kamaji target");
    }

    if (input.executable !== undefined && !isNonEmptyString(input.executable)) {
      throw new InvalidConfigFileException("Invalid Git Kamaji executable");
    }

    if (input.type === "windows") {
      return {
        type: "windows",
        ...(input.executable === undefined
          ? {}
          : { executable: input.executable }),
      };
    }

    if (
      input.distribution !== undefined &&
      !isNonEmptyString(input.distribution)
    ) {
      throw new InvalidConfigFileException(
        "Invalid Git Kamaji WSL distribution",
      );
    }

    return {
      type: "wsl",
      ...(input.distribution === undefined
        ? {}
        : { distribution: input.distribution }),
      ...(input.executable === undefined
        ? {}
        : { executable: input.executable }),
    };
  }

  private mapLogging(input: unknown): GitKamajiConfig["logging"] {
    if (!isObject(input) || typeof input.enabled !== "boolean") {
      throw new InvalidConfigFileException("Invalid Git Kamaji logging");
    }

    if (!input.enabled) return { enabled: false };

    if (input.file !== undefined && !isNonEmptyString(input.file)) {
      throw new InvalidConfigFileException("Invalid Git Kamaji log file");
    }

    return {
      enabled: true,
      ...(input.file === undefined ? {} : { file: input.file }),
    };
  }
}

function isObject(input: unknown): input is JsonObject {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function isNonEmptyString(input: unknown): input is string {
  return typeof input === "string" && input.length > 0;
}
