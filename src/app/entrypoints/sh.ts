import { ExecuteCommandUseCase } from "../../context/command-proxy/application/use-cases/execute-command.use-case";
import { CommandInvocation } from "../../context/command-proxy/domain/value-objects/command-invocation";
import { WslCommandExecutor } from "../../context/command-proxy/infrastructure/adapters/wsl-command-executor";
import { FileCommandLogger } from "../../context/command-proxy/infrastructure/adapters/file-command-logger";
import { defaultConfiguration } from "./configuration";
import { WslDefaultDistribution } from "../../context/command-proxy/infrastructure/adapters/wsl-default-distribution";

const useCase = new ExecuteCommandUseCase(
  new WslCommandExecutor(),
  new FileCommandLogger("gitkamaji.log"),
);
const distribution = new WslDefaultDistribution().resolve();
const exitCode = useCase.execute(
  CommandInvocation.create("sh", process.argv.slice(2)),
  defaultConfiguration(distribution),
);
process.exitCode = exitCode;
