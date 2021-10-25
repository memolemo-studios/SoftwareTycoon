import { Flamework } from "@flamework/core";
import Log, { Logger, LogLevel } from "@rbxts/log";
import Roact, { mount } from "@rbxts/roact";
import { StoreProvider } from "@rbxts/roact-rodux";
import { Players, RunService } from "@rbxts/services";
import GameStart from "./apps/gameStart";
import { ClientStore } from "./store/store";

Log.SetLogger(
	Logger.configure()
		.EnrichWithProperty("$VERSION", PKG_VERSION)
		.SetMinLogLevel(RunService.IsStudio() ? LogLevel.Verbose : LogLevel.Information)
		.WriteTo(Log.RobloxOutput())
		.Create(),
);

// mount roact ui
Log.Info("Mounting Roact UI");

const element = (
	<StoreProvider store={ClientStore}>
		<screengui ResetOnSpawn={true}>
			<GameStart />
		</screengui>
	</StoreProvider>
);

const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui");
mount(element, player_gui, "software_tycoon_gui");

// initialize flamework
Log.Info("Initializing Flamework");

Flamework.addPaths("src/client/components", "src/shared/flamework", "src/client/controllers");
Flamework.ignite();

Log.Info("Flamework is now initialized");
