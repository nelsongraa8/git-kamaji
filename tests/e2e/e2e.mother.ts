export const e2eMother = {
  arguments: {
    gitStatus: () => ["status", "--porcelain"],
    bashCommand: () => ["-c", "printf hello", "argument with spaces"],
    shCommand: () => ["-c", 'printf "hello"', "C:\\workspace\\repo"],
  },
  config: {
    windows: (executable: string, logging = false) => ({
      target: { type: "windows", executable },
      logging: logging
        ? { enabled: true, file: "gitkamaji.log" }
        : { enabled: false },
    }),
    wsl: (distribution = "Ubuntu") => ({
      target: { type: "wsl", distribution, executable: "git" },
      logging: { enabled: true, file: "gitkamaji.log" },
    }),
  },
};
