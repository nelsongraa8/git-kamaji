import { expect, test } from "bun:test";
import { WslDistributionOutputMapper } from "../../src/context/command-proxy/infrastructure/mappers/wsl-distribution-output.mapper";
import { commandProxyMother } from "../mothers/command-proxy.mother";

test("maps Ubuntu when it is marked as default", () => {
  const actual = new WslDistributionOutputMapper().map(
    commandProxyMother.wslOutput.ubuntu(),
  );

  expect(actual).toBe(commandProxyMother.expected.distribution());
});
