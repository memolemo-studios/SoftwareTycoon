import { Flamework } from "@flamework/core";
import Log from "@rbxts/log";
import { setupLogger } from "shared/functions/setupLogger";

// setting up the logger
setupLogger();
Log.Warn("Software Tycoon client version: {VERSION}");

// prettier-ignore
Flamework.addPaths(
	"src/client/apps",
	"src/client/controllers",
	"src/client/components",
	"src/shared/components",
	"src/shared/flamework"
);
Flamework.ignite();
