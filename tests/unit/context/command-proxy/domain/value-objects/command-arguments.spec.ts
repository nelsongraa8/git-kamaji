import { describe, expect, test } from "bun:test";
import { CommandArguments } from "../../../../../../src/context/command-proxy/domain/value-objects/command-arguments";
import { commandProxyMother } from "../../../../../support/mothers/command-proxy.mother";

describe("CommandArguments", () => {
  test("creates an empty argument collection", () => {
    const actual = CommandArguments.from([]);

    expect(actual.values).toEqual([]);
  });

  test("copies command arguments on creation", () => {
    const source = commandProxyMother.expected.shellArguments();
    const actual = CommandArguments.from(source);

    source.push("mutated");

    expect(actual.values).toEqual(commandProxyMother.expected.shellArguments());
  });

  test("preserves spaces quotes and Windows paths", () => {
    const actual = CommandArguments.from(
      commandProxyMother.expected.specialArguments(),
    );

    expect(actual.values).toEqual(
      commandProxyMother.expected.specialArguments(),
    );
  });
});
