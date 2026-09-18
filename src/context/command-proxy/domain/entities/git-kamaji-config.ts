export type GitTarget =
  | Readonly<{
      type: "windows";
      executable?: string;
    }>
  | Readonly<{
      type: "wsl";
      distribution?: string;
      executable?: string;
    }>;

export type LoggingConfig =
  | Readonly<{
      enabled: false;
    }>
  | Readonly<{
      enabled: true;
      file?: string;
    }>;

export type GitKamajiConfig = Readonly<{
  target: GitTarget;
  logging: LoggingConfig;
}>;
