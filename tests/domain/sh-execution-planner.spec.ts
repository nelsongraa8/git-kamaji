import { describe, expect, test } from "bun:test";
import { ShExecutionPlanner } from "../../src/context/command-proxy/domain/services/sh-execution-planner";
import { commandProxyMother } from "../mothers/command-proxy.mother";

describe("ShExecutionPlanner", () => {
  test("creates the complete shell-aware Sh WSL execution plan", () => {
    const plan = new ShExecutionPlanner().plan(
      commandProxyMother.shInvocation(
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
      executable: "sh",
      arguments: commandProxyMother.expected.specialArguments(),
      target: "linux",
      distribution: commandProxyMother.expected.distribution(),
      mode: "shell",
      translation: "shell-aware",
    });
  });
});
