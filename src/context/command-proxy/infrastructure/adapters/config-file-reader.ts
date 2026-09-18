import type { ConfigFileReaderPort } from "../../application/ports/out/config-file-reader.port";

export class ConfigFileReader implements ConfigFileReaderPort {
  async exists(filePath: string): Promise<boolean> {
    return Bun.file(filePath).exists();
  }

  async read(filePath: string): Promise<unknown> {
    return JSON.parse(await Bun.file(filePath).text()) as unknown;
  }
}
