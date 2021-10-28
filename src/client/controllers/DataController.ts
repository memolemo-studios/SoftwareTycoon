import { Controller, OnInit, OnTick } from "@flamework/core";
import { ResultSer } from "@memolemo-studios/result-option-ser";
import Log from "@rbxts/log";
import { Functions } from "client/networking";
import Cache from "shared/classes/cache";
import { PlayerDataError } from "shared/errors/playerdata";
import { DEFAULT_PLAYER_DATA } from "shared/util/playerdata";
import { PlayerDataSerializedError } from "types/errors/playerdata";
import { PlayerData } from "types/player/data";

@Controller({})
export class DataController implements OnTick, OnInit {
	private dataCache = new Cache<PlayerData>(() => this.fetchPlayerData());
	private logger = Log.ForContext(DataController);

	private async fetchPlayerData() {
		const result = ResultSer.deserialize<PlayerData, PlayerDataSerializedError>(await Functions.fetchPlayerData());
		if (result.isErr()) {
			throw PlayerDataError.fromSerialized(result.unwrapErr()).toMessage();
		}
		return result.unwrap();
	}

	/**
	 * Gets player's data, simple as that.
	 *
	 * **NOTE**: If the data wasn't loaded yet, then
	 * it returns to default player data.
	 */
	public getPlayerData() {
		try {
			return this.dataCache.getValue();
		} catch {
			this.logger.Warn("Failed to get player's data because it is not loaded yet");
			return DEFAULT_PLAYER_DATA;
		}
	}

	/** @hidden */
	public onInit() {
		this.logger.Info("Starting to fetch player's data");
	}

	/** @hidden */
	public onTick() {
		// time to update player's data
		if (this.dataCache.canUpdate()) {
			this.logger.Verbose("Fetching player's data to DataService");
			this.dataCache.updateValue();
		}
	}
}
