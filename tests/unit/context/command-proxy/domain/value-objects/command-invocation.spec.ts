import { describe, expect, test } from "bun:test";
import { commandProxyMother } from "../../../../../support/mothers/command-proxy.mother";

describe("CommandInvocation", () => {
  test("creates an invocation with its command kind", () => {
    const actual = commandProxyMother.gitInvocation();

    expect(actual.kind).toBe("git");
  });
});
