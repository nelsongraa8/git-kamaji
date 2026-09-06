import { describe, expect, test } from "bun:test";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("ExecutionPlan", () => {
  test("creates a valid Linux execution plan", () => {
    const actual = commandProxyMother.plan();

    expect(actual.distribution?.value).toBe(
      commandProxyMother.expected.distribution(),
    );
  });
});
