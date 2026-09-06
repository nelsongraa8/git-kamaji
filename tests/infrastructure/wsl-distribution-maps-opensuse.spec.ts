import { expect, test } from "bun:test";
import { WslDistributionOutputMapper } from "../../src/context/command-proxy/infrastructure/mappers/wsl-distribution-output.mapper";
import { commandProxyMother } from "../mothers/command-proxy.mother";

test("maps openSUSE when it is marked as default", () => {
  const actual = new WslDistributionOutputMapper().map(
    commandProxyMother.wslOutput.opensuse(),
  );

  expect(actual).toBe(commandProxyMother.expected.opensuseDistribution());
});
