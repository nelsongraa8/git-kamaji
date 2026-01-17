const { spawnSync } = require("child_process");

const args = process.argv.slice(2);
const DISTRO_NAME = "Ubuntu";

function windowsToWsl(p: string): string {
  if (!p) return p;

  const uncPrefix = `\\\\wsl.localhost\\${DISTRO_NAME}`;
  if (p.startsWith(uncPrefix))
    return p.replace(uncPrefix, "").split("\\").join("/");

  const oldUncPrefix = `\\\\wsl$\\${DISTRO_NAME}`;
  if (p.startsWith(oldUncPrefix))
    return p.replace(oldUncPrefix, "").split("\\").join("/");

  if (/^[a-zA-Z]:\\/.test(p)) {
    const res = spawnSync("wsl", ["-d", DISTRO_NAME, "wslpath", "-u", p], {
      encoding: "utf-8",
    });
    if (res.status === 0) return res.stdout.trim();
  }

  return p;
}

// Traducción de paths (opcional pero recomendable)
const wslArgs = args.map((a) => windowsToWsl(a));

// Construcción segura del comando
const command = wslArgs.map((a) => `"${a.replace(/"/g, '\\"')}"`).join(" ");

const result = spawnSync("wsl", ["-d", DISTRO_NAME, "sh", "-c", command], {
  stdio: "inherit",
  encoding: "utf-8",
});

process.exit(result.status ?? 0);
