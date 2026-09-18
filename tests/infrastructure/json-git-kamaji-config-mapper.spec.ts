import { describe, expect, test } from "bun:test";
import { InvalidConfigFileException } from "../../src/context/command-proxy/domain/errors/invalid-config-file.exception";
import type { GitKamajiConfig } from "../../src/context/command-proxy/domain/entities/git-kamaji-config";
import { JsonGitKamajiConfigMapper } from "../../src/context/command-proxy/infrastructure/mappers/json-git-kamaji-config.mapper";
import { gitKamajiConfigMother } from "../mothers/git-kamaji-config.mother";

describe("JsonGitKamajiConfigMapper", () => {
  const mapper = new JsonGitKamajiConfigMapper();

  const validConfigurations: ReadonlyArray<{
    name: string;
    input: unknown;
    expected: GitKamajiConfig;
  }> = [
    {
      name: "WSL with all optional values",
      input: gitKamajiConfigMother.wslJson(),
      expected: gitKamajiConfigMother.wsl(),
    },
    {
      name: "WSL without a logging file",
      input: gitKamajiConfigMother.wslWithoutLoggingFileJson(),
      expected: {
        target: { type: "wsl", distribution: "Debian" },
        logging: { enabled: true },
      },
    },
    {
      name: "WSL without optional values",
      input: gitKamajiConfigMother.wslWithoutOptionalValuesJson(),
      expected: {
        target: { type: "wsl" },
        logging: { enabled: true },
      },
    },
    {
      name: "Windows with logging disabled",
      input: gitKamajiConfigMother.windowsJson(),
      expected: gitKamajiConfigMother.windows(),
    },
    {
      name: "Windows with a custom executable and log file",
      input: gitKamajiConfigMother.windowsJsonWithLoggingFile(),
      expected: {
        target: { type: "windows", executable: "custom-git.exe" },
        logging: { enabled: true, file: "windows-git.log" },
      },
    },
    {
      name: "Windows without an executable",
      input: gitKamajiConfigMother.windowsWithoutExecutableJson(),
      expected: { target: { type: "windows" }, logging: { enabled: false } },
    },
  ];

  for (const configuration of validConfigurations) {
    test(`maps ${configuration.name}`, () => {
      const config = mapper.map(configuration.input);

      expect(config).toEqual(configuration.expected);
    });
  }

  const invalidConfigurations = [
    ["an empty object", gitKamajiConfigMother.invalidJson.emptyObject()],
    ["null", gitKamajiConfigMother.invalidJson.nullValue()],
    ["an array", gitKamajiConfigMother.invalidJson.array()],
    ["a missing target", gitKamajiConfigMother.invalidJson.missingTarget()],
    [
      "a missing logging section",
      gitKamajiConfigMother.invalidJson.missingLogging(),
    ],
    [
      "an invalid target type",
      gitKamajiConfigMother.invalidJson.invalidTargetType(),
    ],
    [
      "a non-object target",
      gitKamajiConfigMother.invalidJson.invalidTargetValue(),
    ],
    [
      "an empty executable",
      gitKamajiConfigMother.invalidJson.emptyExecutable(),
    ],
    [
      "a non-string executable",
      gitKamajiConfigMother.invalidJson.nonStringExecutable(),
    ],
    [
      "an empty WSL distribution",
      gitKamajiConfigMother.invalidJson.emptyDistribution(),
    ],
    [
      "a non-string WSL distribution",
      gitKamajiConfigMother.invalidJson.nonStringDistribution(),
    ],
    [
      "logging without enabled",
      gitKamajiConfigMother.invalidJson.missingLoggingEnabled(),
    ],
    [
      "logging with a non-boolean enabled value",
      gitKamajiConfigMother.invalidJson.nonBooleanLoggingEnabled(),
    ],
    [
      "an empty logging file",
      gitKamajiConfigMother.invalidJson.emptyLoggingFile(),
    ],
    [
      "a non-string logging file",
      gitKamajiConfigMother.invalidJson.nonStringLoggingFile(),
    ],
  ] as const;

  for (const [name, input] of invalidConfigurations) {
    test(`rejects ${name}`, () => {
      expect(() => mapper.map(input)).toThrow(InvalidConfigFileException);
    });
  }

  test("supports objects with the required top-level sections", () => {
    expect(mapper.supports(gitKamajiConfigMother.wslJson())).toBe(true);
  });

  test("does not support objects without the required top-level sections", () => {
    expect(
      mapper.supports(gitKamajiConfigMother.invalidJson.emptyObject()),
    ).toBe(false);
  });
});
