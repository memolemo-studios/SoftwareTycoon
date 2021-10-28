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

Log.Info("Initializing Flamework");

// initialize flamework
Flamework.addPaths("src/client/controllers", "src/client/apps", "src/client/components", "src/shared/flamework");
Flamework.ignite();

Log.Info("Flamework is now initialized");
