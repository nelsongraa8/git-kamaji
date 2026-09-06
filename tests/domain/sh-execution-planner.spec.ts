import { expect, test } from "bun:test";
import { ShExecutionPlanner } from "../../src/context/command-proxy/domain/services/sh-execution-planner";
import { commandProxyMother } from "../mothers/command-proxy.mother";

test("plans Sh as a shell-aware execution", () => {
  const plan = new ShExecutionPlanner().plan(
    commandProxyMother.shInvocation(),
    commandProxyMother.configuration(),
  );

  expect(plan.translation).toBe("shell-aware");
});
