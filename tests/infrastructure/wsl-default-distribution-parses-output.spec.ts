import { expect, test } from "bun:test";
import { WslDefaultDistribution } from "../../src/context/command-proxy/infrastructure/adapters/wsl-default-distribution";
import { commandProxyMother } from "../mothers/command-proxy.mother";

test("resolves the default distro from a standard WSL output", () => {
  const distribution = new WslDefaultDistribution().resolveFromOutput(
    commandProxyMother.wslOutput.ubuntu(),
  );

  expect(distribution.value).toBe(commandProxyMother.expected.distribution());
});

test("resolves the default distro from UTF-16-like output", () => {
  const distribution = new WslDefaultDistribution().resolveFromOutput(
    commandProxyMother.wslOutput.utf16(),
  );

  expect(distribution.value).toBe(commandProxyMother.expected.distribution());
});

test("rejects output without a default distro marker", () => {
  expect(() =>
    new WslDefaultDistribution().resolveFromOutput(
      commandProxyMother.wslOutput.withoutDefault(),
    ),
  ).toThrow("Unable to determine the default WSL distribution");
});
