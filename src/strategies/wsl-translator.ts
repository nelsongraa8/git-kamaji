import type { PathTranslator } from "./interfaces/translator.interface";

export class WslPathTranslator implements PathTranslator {
  constructor(private readonly distro: string) {}

  translate(p: string): string {
    if (!p) return p;
    const uncPrefix = `\\\\wsl.localhost\\${this.distro}`;

    // 1. Path de Red WSL -> Path Interno Linux
    if (p.startsWith(uncPrefix)) {
      return p.replace(uncPrefix, "").replace(/\\/g, "/");
    }

    // 2. Path de Windows (C:\...) -> /mnt/c/...
    if (/^[a-zA-Z]:\\/.test(p)) {
      const drive = p[0]!.toLowerCase();
      return `/mnt/${drive}${p.slice(2).replace(/\\/g, "/")}`;
    }

    return p;
  }
}
