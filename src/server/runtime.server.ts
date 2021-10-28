import { Flamework } from "@flamework/core";
import Log, { Logger, LogLevel } from "@rbxts/log";
import { RunService } from "@rbxts/services";

// logger setup
Log.SetLogger(
	Logger.configure()
		.EnrichWithProperty("VERSION", PKG_VERSION)
		.SetMinLogLevel(RunService.IsStudio() ? LogLevel.Verbose : LogLevel.Information)
		.WriteTo(Log.RobloxOutput())
		.Create(),
);

// initialize flamework
Flamework.addPaths("src/server/services", "src/server/components", "src/shared/flamework");
Flamework.ignite();
