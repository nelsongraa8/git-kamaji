import { spawnSync } from "child_process";
import { writeFileSync } from "fs";
import path from "path";

const args = process.argv.slice(2);
const DISTRO_NAME = "Ubuntu";

function windowsToWsl(p: string): string {
  if (!p) return p;
  // Traducción rápida para rutas UNC
  const uncPrefix = `\\\\wsl.localhost\\${DISTRO_NAME}`;
  if (p.startsWith(uncPrefix)) {
    return p.replace(uncPrefix, "").replace(/\\/g, "/");
  }
  // Para letras de unidad (C:\ -> /mnt/c/) sin spawnear otro proceso
  if (/^[a-zA-Z]:\\/.test(p)) {
    const drive = p[0]!.toLowerCase();
    return `/mnt/${drive}${p.slice(2).replace(/\\/g, "/")}`;
  }
  return p;
}

const wslArgs = args.map(windowsToWsl);

// En Windows, para acceder a la home de WSL desde el host:
const repoPath = `\\\\wsl.localhost\\${DISTRO_NAME}\\home\\nelsongraa8\\Code\\card-dock-frontend`;

const git = spawnSync("wsl", ["-d", DISTRO_NAME, "git", ...wslArgs], {
  stdio: "inherit",
  encoding: "utf-8",
  cwd: repoPath, // Ahora Windows sí encuentra la ruta
});

// Logging mejorado 📝
const logFile = path.join(process.cwd(), "gitkamaji-log.txt");
const logEntry = `
Command Executed: wsl -d ${DISTRO_NAME} git ${wslArgs.join(" ")}
Exit Code: ${git.status}
Error: ${git.error ?? "None"}
-----------------------------------`;

writeFileSync(logFile, logEntry, { flag: "a" });

process.exit(git.status ?? 1);
