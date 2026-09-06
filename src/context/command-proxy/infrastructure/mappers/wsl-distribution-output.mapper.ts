export class WslDistributionOutputMapper {
  map(stdout: string | Buffer | null): string | undefined {
    if (stdout === null) return undefined;

    const output = stdout
      .toString()
      .replaceAll("\0", "")
      .replace(/^\uFEFF/, "");
    const defaultLine = output
      .split(/\r?\n/)
      .map((value) => value.trim())
      .find((value) => value.startsWith("*"));
    const match = defaultLine?.match(/^\*\s+(.+?)\s+\S+\s+\d+\s*$/);

    return match?.[1]?.trim() || undefined;
  }
}
