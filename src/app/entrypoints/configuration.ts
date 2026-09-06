import { ProjectConfiguration } from "../../context/command-proxy/domain/entities/project-configuration";
import { Executable } from "../../context/command-proxy/domain/value-objects/executable";
import { LinuxDistribution } from "../../context/command-proxy/domain/value-objects/linux-distribution";
import { ProjectRoot } from "../../context/command-proxy/domain/value-objects/project-root";

export function defaultConfiguration(
  distribution: LinuxDistribution,
): ProjectConfiguration {
  return new ProjectConfiguration(
    ProjectRoot.from(process.cwd()),
    {
      target: "linux",
      distribution,
      executable: Executable.from("git"),
      mode: "direct",
      translation: "windows-to-linux",
    },
    { target: "linux", distribution, executable: Executable.from("bash") },
    {
      distribution,
      executable: Executable.from("sh"),
      translation: "shell-aware",
    },
  );
}
