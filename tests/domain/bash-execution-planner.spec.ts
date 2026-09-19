import { describe, expect, test } from "bun:test";
import { BashExecutionPlanner } from "../../src/context/command-proxy/domain/services/bash-execution-planner";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("BashExecutionPlanner", () => {
  test("creates the complete Bash WSL execution plan", () => {
    const plan = new BashExecutionPlanner().plan(
      commandProxyMother.bashInvocation(
        commandProxyMother.expected.specialArguments(),
      ),
      commandProxyMother.configuration(),
    );

    expect({
      executable: plan.executable.value,
      arguments: plan.planArguments,
      target: plan.target,
      distribution: plan.distribution?.value,
      mode: plan.mode,
      translation: plan.translation,
    }).toEqual({
      executable: "bash",
      arguments: commandProxyMother.expected.specialArguments(),
      target: "linux",
      distribution: commandProxyMother.expected.distribution(),
      mode: "direct",
      translation: "preserve",
    });
  });
});
