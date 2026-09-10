import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const pkg = JSON.parse(
  readFileSync(join(import.meta.dir, "..", "package.json"), "utf-8"),
);
const version = pkg.version;
const outDir = join(import.meta.dir, "..", "dist");
const zipName = `git-kamaji-v${version}.zip`;
const zipPath = join(outDir, zipName);

const exeFiles = readdirSync(outDir).filter((f) => f.endsWith(".exe"));

if (exeFiles.length === 0) {
  console.error("No .exe files found in dist/. Run `bun run build` first.");
  process.exit(1);
}

console.log(`Packaging v${version}: ${exeFiles.join(", ")}`);

let result;

if (process.platform === "win32") {
  const sourceFiles = exeFiles.map((f) => join(outDir, f));
  result = spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path '${sourceFiles.join("','")}' -DestinationPath '${zipPath}' -Force`,
    ],
    { stdio: "inherit" },
  );
} else {
  result = spawnSync(
    "zip",
    ["-j", zipPath, ...exeFiles.map((f) => join(outDir, f))],
    { stdio: "inherit", cwd: outDir },
  );
}

if (result.status !== 0) {
  console.error("Failed to create zip archive.");
  process.exit(1);
}

console.log(`Created ${zipName}`);
