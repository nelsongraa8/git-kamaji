import { GitBridge } from "./core/git-bridge";
import { KamajiEngine } from "./engine";
import { Logger } from "./services/logger";
import { WslPathTranslator } from "./strategies/wsl-translator";

// --- Bootstrap --- //
const DISTRO = "openSUSE-Tumbleweed-Custom";

const filename = "gitkamaji.log";
const logger = new Logger(filename);

const translator = new WslPathTranslator(DISTRO);
const bridge = new GitBridge(DISTRO, translator);
const engine = new KamajiEngine(DISTRO, bridge, logger);

engine.run(process.argv.slice(2));
