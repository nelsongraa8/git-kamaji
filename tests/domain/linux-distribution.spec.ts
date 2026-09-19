import { describe, expect, test } from "bun:test";
import { LinuxDistribution } from "../../src/context/command-proxy/domain/value-objects/linux-distribution";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("LinuxDistribution", () => {
  test("creates a distribution from a non-empty value", () => {
    expect(
      LinuxDistribution.from(commandProxyMother.distribution().value).value,
    ).toBe(commandProxyMother.expected.distribution());
  });

  test("rejects an empty value", () => {
    expect(() => LinuxDistribution.from("")).toThrow(
      "Linux distribution cannot be empty",
    );
  });
});
