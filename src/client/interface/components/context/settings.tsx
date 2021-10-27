import { Dependency } from "@flamework/core";
import Roact, { createContext } from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import { RunService } from "@rbxts/services";
import { DataReplicaController } from "client/controllers/replication/DataReplicaController";
import { PlayerSettings } from "shared/data/types";

const settings_context = createContext(undefined as unknown as PlayerSettings);
const hoarcekat_settings: PlayerSettings = {
	SoundsEnabled: false,
};
let replica_controller: DataReplicaController;

function loadReplicaController() {
	replica_controller ?? Dependency<DataReplicaController>();
}

export const SettngsProvider = new RoactHooks(Roact)<RoactHooks.FC<{}>>((props, { useState, useEffect }) => {
	const [settings, set_settings] = useState(hoarcekat_settings);
	useEffect(() => {
		// hoarcekat
		if (RunService.IsRunning()) {
			let conn: RBXScriptConnection;

			// load replica_controller
			loadReplicaController();

			// request for data using DataReplicaController
			try {
				set_settings(replica_controller.getPlayerData().Settings);
			} catch {}

			// eslint-disable-next-line prefer-const
			conn = replica_controller.onPlayerDataChanged.Connect(data => set_settings(data.Settings));
			return () => conn.Disconnect();
		}
	});
	return <settings_context.Provider value={settings}>{props[Roact.Children]}</settings_context.Provider>;
});

export function withSettings(callback: (settings: PlayerSettings) => Roact.Element) {
	return (
		<settings_context.Consumer
			render={settings => {
				assert(settings === undefined, "Failed to load settings!");
				return callback(settings);
			}}
		/>
	);
}
