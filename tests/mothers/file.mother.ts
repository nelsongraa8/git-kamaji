import { gitKamajiConfigMother } from "./git-kamaji-config.mother";

export const fileMother = {
  configReaderValidPath: () => ".tmp-config-reader-valid.json",
  configReaderInvalidPath: () => ".tmp-config-reader-invalid.json",
  configReaderEmptyPath: () => ".tmp-config-reader-empty.json",
  configReaderStructuredInvalidPath: () =>
    ".tmp-config-reader-structured-invalid.json",
  missingPath: () => ".tmp-config-reader-missing.json",
  validConfigJson: () => JSON.stringify(gitKamajiConfigMother.wslJson()),
  invalidJson: () => "{ invalid json",
  emptyJson: () => "",
  structuredInvalidJson: () =>
    JSON.stringify(gitKamajiConfigMother.invalidJson.emptyObject()),
  loggerEntryPath: () => ".tmp-command-logger-entry.log",
  loggerAppendPath: () => ".tmp-command-logger-append.log",
  loggerUnwritablePath: () => ".tmp-missing-directory/command.log",
};
