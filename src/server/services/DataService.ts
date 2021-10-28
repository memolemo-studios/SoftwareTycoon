import { Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Result } from "@rbxts/rust-classes";
import { PlayerDataError } from "shared/errors/playerdata";
import { DEFAULT_PLAYER_DATA } from "shared/util/playerdata";
import { PlayerData } from "types/player/data";

@Service({})
export class DataService {
	private logger = Log.ForContext(DataService);

	/**
	 * Loads player's profile asynchronously
	 * @returns Result with `PlayerData` and `PlayerDataError`
	 */
	public async loadPlayerProfile(player: Player): Promise<Result<PlayerData, PlayerDataError>> {
		this.logger.Info("Fetching {@Player}'s data", player);

		// TODO: load data something like that
		return Result.ok(DEFAULT_PLAYER_DATA);
	}
}
