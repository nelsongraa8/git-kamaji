import { describe, expect, test } from "bun:test";
import { WslDistributionOutputMapper } from "../../src/context/command-proxy/infrastructure/mappers/wsl-distribution-output.mapper";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("WslDistributionOutputMapper", () => {
  test("returns undefined when no default distribution is marked", () => {
    const actual = new WslDistributionOutputMapper().map(
      commandProxyMother.wslOutput.withoutDefault(),
    );

    expect(actual).toBeUndefined();
  });
});
