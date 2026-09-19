import { ProjectConfiguration } from "../../context/command-proxy/domain/entities/project-configuration";
import type { GitKamajiConfig } from "../../context/command-proxy/domain/entities/git-kamaji-config";
import { Executable } from "../../context/command-proxy/domain/value-objects/executable";
import { LinuxDistribution } from "../../context/command-proxy/domain/value-objects/linux-distribution";
import { ProjectRoot } from "../../context/command-proxy/domain/value-objects/project-root";
import type { CommandLoggerPort } from "../../context/command-proxy/application/ports/out/command-logger.port";
import { FileCommandLogger } from "../../context/command-proxy/infrastructure/adapters/file-command-logger";
import { NoopCommandLogger } from "../../context/command-proxy/infrastructure/adapters/noop-command-logger";

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

export function configurationFrom(
  config: GitKamajiConfig | null,
  defaultDistribution?: LinuxDistribution,
): ProjectConfiguration {
  if (!config) {
    if (!defaultDistribution) {
      throw new Error("Default WSL distribution is required");
    }

    return defaultConfiguration(defaultDistribution);
  }

  const target = config.target;
  const distribution =
    target.type === "windows"
      ? undefined
      : target.distribution
        ? LinuxDistribution.from(target.distribution)
        : defaultDistribution;

  if (target.type === "wsl" && !distribution) {
    throw new Error("WSL configuration requires a distribution");
  }

  return new ProjectConfiguration(
    ProjectRoot.from(process.cwd()),
    target.type === "windows"
      ? {
          target: "host",
          executable: Executable.from(target.executable ?? "git"),
          mode: "direct",
          translation: "preserve",
        }
      : {
          target: "linux",
          distribution,
          executable: Executable.from(target.executable ?? "git"),
          mode: "direct",
          translation: "windows-to-linux",
        },
    {
      target: "linux",
      distribution,
      executable: Executable.from("bash"),
    },
    {
      distribution,
      executable: Executable.from("sh"),
      translation: "shell-aware",
    },
  );
}

export function requiresDefaultDistribution(
  config: GitKamajiConfig | null,
): boolean {
  return (
    config === null ||
    (config.target.type === "wsl" && config.target.distribution === undefined)
  );
}

export function commandLoggerFrom(
  config: GitKamajiConfig | null,
): CommandLoggerPort {
  if (config?.logging.enabled === false) return new NoopCommandLogger();

  return new FileCommandLogger(config?.logging.file ?? "gitkamaji.log");
}
