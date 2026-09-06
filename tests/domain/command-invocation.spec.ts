import { describe, expect, test } from "bun:test";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("CommandInvocation", () => {
  test("creates an invocation with its command kind", () => {
    const actual = commandProxyMother.gitInvocation();

    expect(actual.kind).toBe("git");
  });
});
