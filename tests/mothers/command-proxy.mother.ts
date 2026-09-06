import { ProjectConfiguration } from "../../src/context/command-proxy/domain/entities/project-configuration";
import { CommandInvocation } from "../../src/context/command-proxy/domain/value-objects/command-invocation";
import { Executable } from "../../src/context/command-proxy/domain/value-objects/executable";
import { ExecutionPlan } from "../../src/context/command-proxy/domain/value-objects/execution-plan";
import { LinuxDistribution } from "../../src/context/command-proxy/domain/value-objects/linux-distribution";
import { ProjectRoot } from "../../src/context/command-proxy/domain/value-objects/project-root";

const distribution = LinuxDistribution.from("Ubuntu");

export const commandProxyMother = {
  distribution: () => distribution,
  projectRoot: () => ProjectRoot.from("C:\\workspace"),
  executable: (value = "git") => Executable.from(value),
  gitInvocation: (arguments_ = ["--version"]) =>
    CommandInvocation.create("git", arguments_),
  bashInvocation: (arguments_ = ["--version"]) =>
    CommandInvocation.create("bash", arguments_),
  shInvocation: (arguments_ = ["--version"]) =>
    CommandInvocation.create("sh", arguments_),
  configuration: () =>
    new ProjectConfiguration(
      commandProxyMother.projectRoot(),
      {
        target: "linux",
        distribution,
        executable: commandProxyMother.executable(),
        mode: "direct",
        translation: "windows-to-linux",
      },
      {
        target: "linux",
        distribution,
        executable: commandProxyMother.executable("bash"),
      },
      {
        distribution,
        executable: commandProxyMother.executable("sh"),
        translation: "shell-aware",
      },
    ),
  plan: () =>
    new ExecutionPlan(
      commandProxyMother.executable(),
      ["--version"],
      "linux",
      distribution,
      "direct",
      "windows-to-linux",
    ),
  wslOutput: {
    ubuntu: () =>
      "  NAME                   STATE           VERSION\n* Ubuntu                Running         2\n  openSUSE-Tumbleweed   Stopped         2\n",
    opensuse: () =>
      "  NAME                   STATE           VERSION\r\n* openSUSE-Tumbleweed    Running         2\r\n  Ubuntu                 Stopped         2\r\n",
    utf16: () =>
      `\uFEFF  NAME                   STATE           VERSION\0\n* Ubuntu                Running         2\0\n`,
    withoutDefault: () =>
      "  NAME                   STATE           VERSION\n  Ubuntu                Running         2\n",
  },
  expected: {
    distribution: () => "Ubuntu",
    opensuseDistribution: () => "openSUSE-Tumbleweed",
    exitCode: () => 0,
    shellArguments: () => ["--version"],
  },
};
