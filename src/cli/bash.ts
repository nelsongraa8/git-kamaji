const { spawnSync } = require("child_process");

const DISTRO_NAME = "Ubuntu";

const wslArgs = ["-d", DISTRO_NAME, "--", ...process.argv.slice(2)];

const result = spawnSync("wsl", wslArgs, {
  stdio: "inherit",
  encoding: "utf-8",
});

process.exit(result.status ?? 0);
