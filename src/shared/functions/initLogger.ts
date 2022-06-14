import Log from "@rbxts/log";
import { LogConfig } from "shared/definitions/logger";

/**
 * Initializes logger and do some logging.
 *
 * Ideally, it should be called when the game starts
 * both the server and the client.
 */
export function initLogger() {
  Log.SetLogger(LogConfig.Create());
  Log.Info("{GameName} {SessionSide} running on version {GameVersion} in {SessionEnv}");
}
