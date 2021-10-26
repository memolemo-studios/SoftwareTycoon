import { Flamework } from "@flamework/core";
import Log, { Logger, LogLevel } from "@rbxts/log";
import Roact, { mount } from "@rbxts/roact";
import { StoreProvider } from "@rbxts/roact-rodux";
import { Players, RunService } from "@rbxts/services";
import { $NODE_ENV } from "rbxts-transform-env";
import { AppState } from "shared/types/enums/store/apps";
import MainMenu from "./apps/MainMenu";
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
			<MainMenu />
		</screengui>
	</StoreProvider>
);

const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui");
mount(element, player_gui, "software_tycoon_gui");

// initialize flamework
Log.Info("Initializing Flamework");

Flamework.addPaths("src/client/components", "src/shared/flamework", "src/client/controllers");
Flamework.ignite();
Flamework.isInitialized = true;

Log.Info("Flamework is now initialized");

const node_env = $NODE_ENV;

// only use the main one if $NODE_ENV is development
ClientStore.dispatch({
	type: "set_app_state",

	// main menu screen
	newState: (node_env as string) === "development" ? AppState.Main : AppState.Main,
});
