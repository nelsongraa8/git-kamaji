import type { GitKamajiConfig } from "../../src/context/command-proxy/domain/entities/git-kamaji-config";

export const gitKamajiConfigMother = {
  wsl: (distribution = "Ubuntu"): GitKamajiConfig => ({
    target: { type: "wsl", distribution, executable: "git" },
    logging: { enabled: true, file: "gitkamaji.log" },
  }),
  windows: (): GitKamajiConfig => ({
    target: { type: "windows", executable: "git.exe" },
    logging: { enabled: false },
  }),
  windowsWithExecutable: (): GitKamajiConfig => ({
    target: { type: "windows", executable: "custom-git.exe" },
    logging: { enabled: false },
  }),
  windowsWithLoggingFile: (file = "windows-git.log"): GitKamajiConfig => ({
    target: { type: "windows" },
    logging: { enabled: true, file },
  }),
  wslWithoutDistribution: (): GitKamajiConfig => ({
    target: { type: "wsl" },
    logging: { enabled: true },
  }),
  wslJson: (distribution = "Ubuntu") => ({
    target: { type: "wsl", distribution, executable: "git" },
    logging: { enabled: true, file: "gitkamaji.log" },
  }),
  windowsJson: () => ({
    target: { type: "windows", executable: "git.exe" },
    logging: { enabled: false },
  }),
  windowsJsonWithLoggingFile: () => ({
    target: { type: "windows", executable: "custom-git.exe" },
    logging: { enabled: true, file: "windows-git.log" },
  }),
  windowsWithoutExecutableJson: () => ({
    target: { type: "windows" },
    logging: { enabled: false },
  }),
  wslWithoutOptionalValuesJson: () => ({
    target: { type: "wsl" },
    logging: { enabled: true },
  }),
  wslWithoutLoggingFileJson: (distribution = "Debian") => ({
    target: { type: "wsl", distribution },
    logging: { enabled: true },
  }),
  invalidJson: {
    emptyObject: () => ({}),
    nullValue: () => null,
    array: () => [],
    missingTarget: () => ({ logging: { enabled: false } }),
    missingLogging: () => ({ target: { type: "windows" } }),
    invalidTargetType: () => ({
      target: { type: "macos" },
      logging: { enabled: false },
    }),
    invalidTargetValue: () => ({
      target: "windows",
      logging: { enabled: false },
    }),
    emptyExecutable: () => ({
      target: { type: "windows", executable: "" },
      logging: { enabled: false },
    }),
    nonStringExecutable: () => ({
      target: { type: "windows", executable: 42 },
      logging: { enabled: false },
    }),
    emptyDistribution: () => ({
      target: { type: "wsl", distribution: "" },
      logging: { enabled: false },
    }),
    nonStringDistribution: () => ({
      target: { type: "wsl", distribution: 42 },
      logging: { enabled: false },
    }),
    missingLoggingEnabled: () => ({
      target: { type: "windows" },
      logging: {},
    }),
    nonBooleanLoggingEnabled: () => ({
      target: { type: "windows" },
      logging: { enabled: "true" },
    }),
    emptyLoggingFile: () => ({
      target: { type: "windows" },
      logging: { enabled: true, file: "" },
    }),
    nonStringLoggingFile: () => ({
      target: { type: "windows" },
      logging: { enabled: true, file: 42 },
    }),
  },
};
