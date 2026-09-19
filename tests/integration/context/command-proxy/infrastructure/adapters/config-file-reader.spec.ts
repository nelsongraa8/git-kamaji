import { rmSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { ConfigFileReader } from "../../../../../../src/context/command-proxy/infrastructure/adapters/config-file-reader";
import { fileMother } from "../../../../../support/mothers/file.mother";
import { gitKamajiConfigMother } from "../../../../../support/mothers/git-kamaji-config.mother";

const reader = new ConfigFileReader();

describe("ConfigFileReader", () => {
  test("reads valid JSON", async () => {
    const path = fileMother.configReaderValidPath();
    await Bun.write(path, fileMother.validConfigJson());

    const config = await reader.read(path);
    rmSync(path, { force: true });

    expect(config).toEqual(gitKamajiConfigMother.wslJson());
  });

  test("rejects invalid JSON", async () => {
    const path = fileMother.configReaderInvalidPath();
    await Bun.write(path, fileMother.invalidJson());

    const result = reader.read(path);
    await expect(result).rejects.toThrow(SyntaxError);
    rmSync(path, { force: true });
  });

  test("reports a missing file", async () => {
    const path = fileMother.missingPath();
    rmSync(path, { force: true });

    expect(await reader.exists(path)).toBe(false);
  });

  test("rejects an empty file", async () => {
    const path = fileMother.configReaderEmptyPath();
    await Bun.write(path, fileMother.emptyJson());

    const result = reader.read(path);
    await expect(result).rejects.toThrow(SyntaxError);
    rmSync(path, { force: true });
  });

  test("returns structurally invalid JSON for the mapper to validate", async () => {
    const path = fileMother.configReaderStructuredInvalidPath();
    await Bun.write(path, fileMother.structuredInvalidJson());

    const config = await reader.read(path);
    rmSync(path, { force: true });

    expect(config).toEqual(gitKamajiConfigMother.invalidJson.emptyObject());
  });
});
