import Log, { Logger, LogLevel } from "@rbxts/log";
import { RunService } from "@rbxts/services";
import { isGameInProduction } from "shared/utils/game";

/**
 * The default configuration for this game.
 *
 * **It will work both the server and the client**.
 */
export const LogConfig = Logger.configure()
  .EnrichWithProperty("GameName", "Software Tycoon")
  .EnrichWithProperty("GameVersion", "v0.0.1-alpha.6")
  .EnrichWithProperty("SessionEnv", isGameInProduction() ? "debug" : "production")
  .EnrichWithProperty("SessionSide", RunService.IsClient() ? "client" : "server")
  .SetMinLogLevel(isGameInProduction() ? LogLevel.Information : LogLevel.Verbose)
  .WriteTo(Log.RobloxOutput());
