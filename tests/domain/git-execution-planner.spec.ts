import { describe, expect, test } from "bun:test";
import { GitExecutionPlanner } from "../../src/context/command-proxy/domain/services/git-execution-planner";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("GitExecutionPlanner", () => {
  test("plans Git with Windows-to-Linux translation", () => {
    const plan = new GitExecutionPlanner().plan(
      commandProxyMother.gitInvocation(),
      commandProxyMother.configuration(),
    );

    expect(plan.translation).toBe("windows-to-linux");
  });
});
