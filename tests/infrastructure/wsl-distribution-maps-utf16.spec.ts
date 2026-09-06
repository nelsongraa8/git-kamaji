import { expect, test } from "bun:test";
import { WslDistributionOutputMapper } from "../../src/context/command-proxy/infrastructure/mappers/wsl-distribution-output.mapper";
import { commandProxyMother } from "../mothers/command-proxy.mother";

test("maps output containing UTF-16 null characters", () => {
  const actual = new WslDistributionOutputMapper().map(
    commandProxyMother.wslOutput.utf16(),
  );

  expect(actual).toBe(commandProxyMother.expected.distribution());
});
