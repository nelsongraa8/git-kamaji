import { expect, test } from "bun:test";
import { CommandArguments } from "../../src/context/command-proxy/domain/value-objects/command-arguments";
import { commandProxyMother } from "../mothers/command-proxy.mother";

test("copies command arguments on creation", () => {
  const source = commandProxyMother.expected.shellArguments();
  const actual = CommandArguments.from(source);

  expect(actual.values).toEqual(source);
});
