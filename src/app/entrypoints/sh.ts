import { ExecuteCommandUseCase } from "../../context/command-proxy/application/use-cases/execute-command.use-case";
import { CommandInvocation } from "../../context/command-proxy/domain/value-objects/command-invocation";
import { CommandExecutor } from "../../context/command-proxy/infrastructure/adapters/command-executor";
import { ConfigFileReader } from "../../context/command-proxy/infrastructure/adapters/config-file-reader";
import { ConfigResolver } from "../../context/command-proxy/infrastructure/adapters/config-resolver";
import { HostCommandExecutor } from "../../context/command-proxy/infrastructure/adapters/host-command-executor";
import { JsonGitKamajiConfigMapper } from "../../context/command-proxy/infrastructure/mappers/json-git-kamaji-config.mapper";
import { GitKamajiConfigNormalizer } from "../../context/command-proxy/infrastructure/mappers/git-kamaji-config.normalizer";
import { WslCommandExecutor } from "../../context/command-proxy/infrastructure/adapters/wsl-command-executor";
import { commandLoggerFrom, configurationFrom } from "./configuration";
import { WslDefaultDistribution } from "../../context/command-proxy/infrastructure/adapters/wsl-default-distribution";

const configResolver = new ConfigResolver(
  new ConfigFileReader(),
  new GitKamajiConfigNormalizer([new JsonGitKamajiConfigMapper()]),
);
const config = await configResolver.resolve(process.cwd());
const distribution = new WslDefaultDistribution().resolve();
const useCase = new ExecuteCommandUseCase(
  new CommandExecutor(new WslCommandExecutor(), new HostCommandExecutor()),
  commandLoggerFrom(config),
);
const exitCode = useCase.execute(
  CommandInvocation.create("sh", process.argv.slice(2)),
  configurationFrom(config, distribution),
);
process.exitCode = exitCode;
