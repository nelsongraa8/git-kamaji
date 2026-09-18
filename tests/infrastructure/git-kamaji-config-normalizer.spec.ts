import { describe, expect, test } from "bun:test";
import type { GitKamajiConfig } from "../../src/context/command-proxy/domain/entities/git-kamaji-config";
import { GitKamajiConfigNormalizer } from "../../src/context/command-proxy/infrastructure/mappers/git-kamaji-config.normalizer";
import { gitKamajiConfigMother } from "../mothers/git-kamaji-config.mother";

class MapperFake {
  supportsCalls = 0;

  constructor(
    private readonly supported: boolean,
    private readonly mappedConfig: GitKamajiConfig,
    private readonly mapError?: Error,
  ) {}

  supports(_input: unknown): boolean {
    this.supportsCalls += 1;
    return this.supported;
  }

  map(_input: unknown): GitKamajiConfig {
    if (this.mapError) throw this.mapError;
    return this.mappedConfig;
  }
}

describe("GitKamajiConfigNormalizer", () => {
  test("selects the first compatible mapper", () => {
    const firstMapper = new MapperFake(true, gitKamajiConfigMother.wsl());
    const secondMapper = new MapperFake(true, gitKamajiConfigMother.windows());
    const normalizer = new GitKamajiConfigNormalizer([
      firstMapper,
      secondMapper,
    ]);

    const config = normalizer.normalize(gitKamajiConfigMother.wslJson());

    expect(config).toEqual(gitKamajiConfigMother.wsl());
  });

  test("does not consult mappers after the first compatible mapper", () => {
    const firstMapper = new MapperFake(true, gitKamajiConfigMother.wsl());
    const secondMapper = new MapperFake(true, gitKamajiConfigMother.windows());
    const normalizer = new GitKamajiConfigNormalizer([
      firstMapper,
      secondMapper,
    ]);

    normalizer.normalize(gitKamajiConfigMother.wslJson());

    expect(secondMapper.supportsCalls).toBe(0);
  });

  test("fails when there are no mappers", () => {
    const normalizer = new GitKamajiConfigNormalizer([]);

    expect(() => normalizer.normalize(gitKamajiConfigMother.wslJson())).toThrow(
      "Unsupported Git Kamaji configuration format",
    );
  });

  test("fails when no mapper supports the input", () => {
    const mapper = new MapperFake(false, gitKamajiConfigMother.wsl());
    const normalizer = new GitKamajiConfigNormalizer([mapper]);

    expect(() => normalizer.normalize(gitKamajiConfigMother.wslJson())).toThrow(
      "Unsupported Git Kamaji configuration format",
    );
  });

  test("propagates the selected mapper error", () => {
    const error = new Error("mapper failure");
    const mapper = new MapperFake(true, gitKamajiConfigMother.wsl(), error);
    const normalizer = new GitKamajiConfigNormalizer([mapper]);

    expect(() => normalizer.normalize(gitKamajiConfigMother.wslJson())).toThrow(
      error,
    );
  });
});
