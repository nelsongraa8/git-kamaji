import { expect, test } from "bun:test";
import { commandProxyMother } from "../mothers/command-proxy.mother";

test("creates an invocation with its command kind", () => {
  const actual = commandProxyMother.gitInvocation();

  expect(actual.kind).toBe("git");
});
