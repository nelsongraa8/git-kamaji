import { describe, expect, test } from "bun:test";
import { Executable } from "../../src/context/command-proxy/domain/value-objects/executable";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("Executable", () => {
  test("creates an executable from a non-empty value", () => {
    expect(Executable.from(commandProxyMother.executable().value).value).toBe(
      commandProxyMother.executable().value,
    );
  });

  test("rejects an empty value", () => {
    expect(() => Executable.from("")).toThrow("Executable cannot be empty");
  });
});
