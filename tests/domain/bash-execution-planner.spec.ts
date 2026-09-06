import { describe, expect, test } from "bun:test";
import { BashExecutionPlanner } from "../../src/context/command-proxy/domain/services/bash-execution-planner";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("BashExecutionPlanner", () => {
  test("plans Bash as a direct execution", () => {
    const plan = new BashExecutionPlanner().plan(
      commandProxyMother.bashInvocation(),
      commandProxyMother.configuration(),
    );

    expect(plan.mode).toBe("direct");
  });
});
