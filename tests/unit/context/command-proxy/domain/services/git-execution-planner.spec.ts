import { describe, expect, test } from "bun:test";
import { GitExecutionPlanner } from "../../../../../../src/context/command-proxy/domain/services/git-execution-planner";
import { commandProxyMother } from "../../../../../support/mothers/command-proxy.mother";

describe("GitExecutionPlanner", () => {
  test("creates the complete Git WSL execution plan", () => {
    const plan = new GitExecutionPlanner().plan(
      commandProxyMother.gitInvocation(
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
      executable: "git",
      arguments: commandProxyMother.expected.specialArguments(),
      target: "linux",
      distribution: commandProxyMother.expected.distribution(),
      mode: "direct",
      translation: "windows-to-linux",
    });
  });

  test("creates the complete Git Windows execution plan", () => {
    const plan = new GitExecutionPlanner().plan(
      commandProxyMother.gitInvocation(
        commandProxyMother.expected.specialArguments(),
      ),
      commandProxyMother.windowsConfiguration(),
    );

    expect({
      executable: plan.executable.value,
      arguments: plan.planArguments,
      target: plan.target,
      distribution: plan.distribution,
      mode: plan.mode,
      translation: plan.translation,
    }).toEqual({
      executable: "git.exe",
      arguments: commandProxyMother.expected.specialArguments(),
      target: "host",
      distribution: undefined,
      mode: "direct",
      translation: "preserve",
    });
  });
});
