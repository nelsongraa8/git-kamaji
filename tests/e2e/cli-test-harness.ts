import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { delimiter, join, resolve } from "node:path";
import { tmpdir } from "node:os";

export type E2EBinary = "git" | "bash" | "sh";

export interface CliExecutionResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

interface InvocationTrace {
  readonly args: readonly string[];
  readonly cwd: string;
}

const repositoryRoot = resolve(import.meta.dir, "../..");
const distribution = "Ubuntu";

export class CliTestHarness {
  readonly workingDir: string;
  readonly globalProfileDir: string;
  private readonly executableDir: string;
  private readonly gitTracePath: string;
  private readonly wslTracePath: string;

  constructor() {
    this.workingDir = mkdtempSync(join(tmpdir(), "git-kamaji-e2e-"));
    this.globalProfileDir = join(this.workingDir, "user-profile");
    this.executableDir = join(this.workingDir, "bin");
    this.gitTracePath = join(this.workingDir, "git.trace.json");
    this.wslTracePath = join(this.workingDir, "wsl.trace.jsonl");
    mkdirSync(this.executableDir);
    copyFileSync(
      join(repositoryRoot, "dist", "e2e-mock-git.exe"),
      this.mockGitExecutable(),
    );
  }

  createConfig(content: object | string): void {
    this.writeConfig(this.workingDir, content);
  }

  createGlobalConfig(content: object | string): void {
    mkdirSync(this.globalProfileDir, { recursive: true });
    this.writeConfig(this.globalProfileDir, content);
  }

  private writeConfig(directory: string, content: object | string): void {
    const fileContent =
      typeof content === "string" ? content : JSON.stringify(content, null, 2);
    writeFileSync(join(directory, ".git-kamajirc.json"), fileContent, "utf-8");
  }

  mockGitExecutable(): string {
    return join(this.executableDir, "mock-git.exe");
  }

  logPath(filename: string): string {
    return join(this.workingDir, filename);
  }

  readGitTrace(): InvocationTrace | undefined {
    if (!existsSync(this.gitTracePath)) return undefined;

    return JSON.parse(
      readFileSync(this.gitTracePath, "utf-8"),
    ) as InvocationTrace;
  }

  readWslTrace(): readonly InvocationTrace[] {
    if (!existsSync(this.wslTracePath)) return [];

    return readFileSync(this.wslTracePath, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as InvocationTrace);
  }

  async run(
    binary: E2EBinary,
    args: readonly string[] = [],
    env: Record<string, string> = {},
  ): Promise<CliExecutionResult> {
    const binaryPath = join(this.executableDir, `${binary}.exe`);
    copyFileSync(join(repositoryRoot, "dist", `${binary}.exe`), binaryPath);
    copyFileSync(
      join(repositoryRoot, "dist", "e2e-mock-wsl.exe"),
      join(this.executableDir, "wsl.exe"),
    );

    const child = Bun.spawn([binaryPath, ...args], {
      cwd: this.workingDir,
      env: {
        ...Bun.env,
        ...env,
        USERPROFILE: this.globalProfileDir,
        E2E_GIT_TRACE_FILE: this.gitTracePath,
        E2E_WSL_TRACE_FILE: this.wslTracePath,
        E2E_WSL_DISTRIBUTION: distribution,
        PATH: `${this.executableDir}${delimiter}${Bun.env.PATH ?? ""}`,
      },
      stdout: "pipe",
      stderr: "pipe",
    });

    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);

    return { exitCode, stdout, stderr };
  }

  cleanup(): void {
    rmSync(this.workingDir, { recursive: true, force: true });
  }
}

export function appendTrace(path: string, trace: InvocationTrace): void {
  appendFileSync(path, `${JSON.stringify(trace)}\n`, "utf-8");
}
