import { Flamework } from "@flamework/core";
import Log from "@rbxts/log";
import { setupLogger } from "shared/functions/setupLogger";

// TODO: when it is time to merge branches to develop
// the character must be spawned whenever the character dies
// by using remotes

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
