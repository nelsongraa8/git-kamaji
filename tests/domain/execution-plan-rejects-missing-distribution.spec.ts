import { expect, test } from "bun:test";
import { ExecutionPlan } from "../../src/context/command-proxy/domain/value-objects/execution-plan";
import { commandProxyMother } from "../mothers/command-proxy.mother";

test("rejects a Linux plan without a distribution", () => {
  const createPlan = () =>
    new ExecutionPlan(
      commandProxyMother.executable(),
      commandProxyMother.expected.shellArguments(),
      "linux",
      undefined,
      "direct",
      "preserve",
    );

  expect(createPlan).toThrow("Linux execution requires a distribution");
});
