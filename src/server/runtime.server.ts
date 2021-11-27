import { Flamework } from "@flamework/core";
import Log from "@rbxts/log";
import { setupLogger } from "shared/functions/setupLogger";

// setting up the logger
setupLogger();
Log.Warn("Software Tycoon server version: {VERSION}");

// prettier-ignore
Flamework.addPaths(
	"src/server/services",
	"src/server/components",
	"src/shared/components",
	"src/shared/flamework"
);
Flamework.ignite();
