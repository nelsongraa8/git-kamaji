import { describe, expect, test } from "bun:test";
import { WslCommandExecutor } from "../../src/context/command-proxy/infrastructure/adapters/wsl-command-executor";
import { commandProxyMother } from "../mothers/command-proxy.mother";

const executor = new WslCommandExecutor() as any;

describe("WslCommandExecutor", () => {
  test("translates Windows drive paths to Linux mount points", () => {
    const plan = commandProxyMother.plan();

    const actual = executor.translate("C:\\workspace\\repo", plan);

    expect(actual).toBe("/mnt/c/workspace/repo");
  });

  test("translates WSL UNC paths to Linux paths", () => {
    const plan = commandProxyMother.plan();

    const actual = executor.translate(
      "\\\\wsl.localhost\\Ubuntu\\home\\user\\repo",
      plan,
    );

    expect(actual).toBe("/home/user/repo");
  });

  test("keeps original values when translation is preserve", () => {
    const plan = { ...commandProxyMother.plan(), translation: "preserve" };

    const actual = executor.translate("C:\\workspace\\repo", plan);

    expect(actual).toBe("C:\\workspace\\repo");
  });

  test("quotes shell arguments and escapes embedded double quotes", () => {
    const actual = executor.quote(['hello "world"', "C:\\temp\\repo"]);

    expect(actual).toBe('"hello \\"world\\"" "C:\\temp\\repo"');
  });
});
