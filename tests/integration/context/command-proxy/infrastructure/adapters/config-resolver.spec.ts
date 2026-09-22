import { describe, expect, test } from "bun:test";
import { ConfigResolver } from "../../../../../../src/context/command-proxy/infrastructure/adapters/config-resolver";
import { GitKamajiConfigNormalizer } from "../../../../../../src/context/command-proxy/infrastructure/mappers/git-kamaji-config.normalizer";
import { JsonGitKamajiConfigMapper } from "../../../../../../src/context/command-proxy/infrastructure/mappers/json-git-kamaji-config.mapper";
import { gitKamajiConfigMother } from "../../../../../support/mothers/git-kamaji-config.mother";

class ConfigFileReaderFake {
  readonly existsCalls: string[] = [];
  readonly readCalls: string[] = [];

  constructor(private readonly files: Readonly<Record<string, unknown>>) {}

  async exists(filePath: string): Promise<boolean> {
    this.existsCalls.push(filePath);
    return filePath in this.files;
  }

  async read(filePath: string): Promise<unknown> {
    this.readCalls.push(filePath);
    return this.files[filePath];
  }
}

const normalizer = new GitKamajiConfigNormalizer([
  new JsonGitKamajiConfigMapper(),
]);

describe("ConfigResolver", () => {
  test("prefers project configuration over global configuration", async () => {
    const resolver = new ConfigResolver(
      new ConfigFileReaderFake({
        "/project/.git-kamajirc.json": gitKamajiConfigMother.wslJson(),
        "/user/.git-kamajirc.json": gitKamajiConfigMother.wslJson("Debian"),
      }),
      normalizer,
      "/user",
    );

    const config = await resolver.resolve("/project");

    expect(config).toEqual(gitKamajiConfigMother.wsl());
  });

  test("uses USERPROFILE configuration when project configuration is absent", async () => {
    const resolver = new ConfigResolver(
      new ConfigFileReaderFake({
        "/user/.git-kamajirc.json": gitKamajiConfigMother.wslJson("Debian"),
      }),
      normalizer,
      "/user",
    );

    const config = await resolver.resolve("/project");

    expect(config).toEqual(gitKamajiConfigMother.wsl("Debian"));
  });

  test("does not use HOME when USERPROFILE is absent", async () => {
    const reader = new ConfigFileReaderFake({
      "/home/user/.git-kamajirc.json": gitKamajiConfigMother.wslJson(),
    });
    const resolver = new ConfigResolver(reader, normalizer, undefined);

    const config = await resolver.resolve("/project");

    expect(config).toBeNull();
  });

  test("returns null when local and global configuration are absent", async () => {
    const reader = new ConfigFileReaderFake({});
    const resolver = new ConfigResolver(reader, normalizer, "/user");

    const config = await resolver.resolve("/project");

    expect(config).toBeNull();
  });

  test("checks the local and global configuration paths", async () => {
    const reader = new ConfigFileReaderFake({});
    const resolver = new ConfigResolver(reader, normalizer, "/user");

    await resolver.resolve("/project");

    expect(reader.existsCalls).toEqual([
      "/project/.git-kamajirc.json",
      "/user/.git-kamajirc.json",
    ]);
  });

  test("resolves project configuration from a Windows UNC path", async () => {
    const projectRoot =
      "\\\\wsl.localhost\\openSUSE-Tumbleweed\\home\\nelsongraa8\\apps\\card-embedding-recognition";
    const localFile = `${projectRoot}\\.git-kamajirc.json`;
    const reader = new ConfigFileReaderFake({
      [localFile]: gitKamajiConfigMother.wslJson(),
    });
    const resolver = new ConfigResolver(reader, normalizer, undefined);

    await resolver.resolve(projectRoot);

    expect(reader.existsCalls).toEqual([localFile]);
  });

  test("prefers local configuration over USERPROFILE for a Windows UNC path", async () => {
    const projectRoot =
      "\\\\wsl.localhost\\openSUSE-Tumbleweed\\home\\nelsongraa8\\apps\\card-embedding-recognition";
    const localFile = `${projectRoot}\\.git-kamajirc.json`;
    const globalFile = "C:\\Users\\nelsongraa8\\.git-kamajirc.json";
    const reader = new ConfigFileReaderFake({
      [localFile]: gitKamajiConfigMother.wslJson(),
      [globalFile]: gitKamajiConfigMother.wslJson("Debian"),
    });
    const resolver = new ConfigResolver(
      reader,
      normalizer,
      "C:\\Users\\nelsongraa8",
    );

    const config = await resolver.resolve(projectRoot);

    expect(config).toEqual(gitKamajiConfigMother.wsl());
  });

  test("does not fall back to global configuration when local configuration is invalid", async () => {
    const reader = new ConfigFileReaderFake({
      "/project/.git-kamajirc.json":
        gitKamajiConfigMother.invalidJson.emptyObject(),
      "/user/.git-kamajirc.json": gitKamajiConfigMother.wslJson(),
    });
    const resolver = new ConfigResolver(reader, normalizer, "/user");

    expect(resolver.resolve("/project")).rejects.toThrow(
      "Unsupported Git Kamaji configuration format",
    );
  });

  test("fails when global configuration is invalid", async () => {
    const resolver = new ConfigResolver(
      new ConfigFileReaderFake({
        "/user/.git-kamajirc.json":
          gitKamajiConfigMother.invalidJson.emptyObject(),
      }),
      normalizer,
      "/user",
    );

    expect(resolver.resolve("/project")).rejects.toThrow(
      "Unsupported Git Kamaji configuration format",
    );
  });

  test("does not consult a global path when USERPROFILE is empty", async () => {
    const reader = new ConfigFileReaderFake({
      "/user/.git-kamajirc.json": gitKamajiConfigMother.wslJson(),
    });
    const resolver = new ConfigResolver(reader, normalizer, "");

    await resolver.resolve("/project");

    expect(reader.existsCalls).toEqual(["/project/.git-kamajirc.json"]);
  });
});
