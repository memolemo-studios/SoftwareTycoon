import { Controller, OnInit } from "@flamework/core";
import Signal from "@rbxts/goodsignal";
import Log from "@rbxts/log";
import { Result } from "@rbxts/rust-classes";
import { Remotes } from "client/events";
import { PlayerData } from "shared/data/types";
import { Deserialize, SerTypes } from "shared/replication/serialize";
import { DataRequestErrors } from "shared/types/enums/errors/dataErrors";
import { RemoteRequestErrors } from "shared/types/enums/errors/remote";

let player_data_cache: PlayerData;

const request_data_remote = Remotes.Get("requestPlayerData");
const on_updated_remote = Remotes.Get("onUpdatedPlayerData");

@Controller({})
export class DataReplicaController implements OnInit {
	private logger = Log.ForContext(DataReplicaController);

	public onPlayerDataChanged = new Signal<(newData: PlayerData) => void>();

	public getPlayerData() {
		assert(player_data_cache, "Player data didn't load.");
		return player_data_cache;
	}

	public async requestPlayerData() {
		return this.requestPlayerDataSync();
	}

	public requestPlayerDataSync(): Result<PlayerData, RemoteRequestErrors | DataRequestErrors> {
		const [success, value] = request_data_remote.CallServerAsync().await() as LuaTuple<
			[boolean, SerTypes.Result<PlayerData, DataRequestErrors>]
		>;

		// timeout because of @rbxts/net
		if (!success) {
			return Result.err(DataRequestErrors.DataNotLoaded);
		}

		// deserializing result
		try {
			const res = Deserialize.result(value);

			// update the cache, if it is successfully load
			if (res.isOk()) {
				player_data_cache = res.unwrap();
				this.onPlayerDataChanged.Fire(player_data_cache);
			}

			return res;
		} catch {
			return Result.err(RemoteRequestErrors.DeserializationError);
		}
	}

	public async onInit() {
		on_updated_remote.Connect(newData => (player_data_cache = newData));

		// load player's data on start and retry if it fails
		let success = false;
		while (!success) {
			const result = this.requestPlayerDataSync();
			if (result.isOk()) {
				success = true;
			} else {
				this.logger.Error("Unexpected data loading error ({Error}). Retrying...", result.unwrapErr());
			}
		}
	}
}
