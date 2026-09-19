import { describe, expect, test } from "bun:test";
import { ProjectRoot } from "../../../../../../src/context/command-proxy/domain/value-objects/project-root";
import { commandProxyMother } from "../../../../../support/mothers/command-proxy.mother";

describe("ProjectRoot", () => {
  test("creates a project root from a non-empty value", () => {
    expect(ProjectRoot.from(commandProxyMother.projectRoot().value).value).toBe(
      commandProxyMother.projectRoot().value,
    );
  });

  test("rejects an empty value", () => {
    expect(() => ProjectRoot.from("")).toThrow("Project root cannot be empty");
  });
});
