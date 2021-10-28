import { OnInit, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { GetProfileStore } from "@rbxts/profileservice";
import { Result } from "@rbxts/rust-classes";
import { Players, RunService } from "@rbxts/services";
import { PlayerDataError } from "shared/errors/playerdata";
import { DEFAULT_PLAYER_DATA } from "shared/util/playerdata";
import { PlayerDataErrorKind } from "types/errors/playerdata";
import { PlayerDataProfile } from "types/player/data";

type LoadResult = Result<PlayerDataProfile, PlayerDataError>;

@Service({})
export class DataService implements OnInit {
	private logger = Log.ForContext(DataService);
	private profileStore = GetProfileStore("PlayerData", DEFAULT_PLAYER_DATA);

	/** @hidden */
	public onInit() {
		// use mock if it is in Studio
		if (RunService.IsStudio()) {
			this.profileStore = this.profileStore.Mock;
		}
	}

	/**
	 * Loads player's profile asynchronously
	 * @returns Result with `PlayerData` and `PlayerDataError`
	 */
	public async loadPlayerProfile(player: Player): Promise<LoadResult> {
		this.logger.Info("Fetching {Player}'s data", player.UserId);

		// load player's profile as possible
		const data_key = tostring(player.UserId);
		const profile = this.profileStore.LoadProfileAsync(data_key, "ForceLoad");

		// profile couldn't be loaded possibly due to roblox servers
		if (profile === undefined) {
			return PlayerDataError.makeResult(PlayerDataErrorKind.ProfileNotLoaded) as LoadResult;
		}

		// the player left before the profile could be loaded
		if (!player.IsDescendantOf(Players)) {
			profile.Release();
			return PlayerDataError.makeResult(PlayerDataErrorKind.PlayerLeftGame) as LoadResult;
		}

		// fill in missing values from default data
		profile.Reconcile();

		// GDPR compliance
		profile.AddUserId(player.UserId);

		// session locking
		profile.ListenToRelease(() => {
			if (!player.IsDescendantOf(Players)) return;

			// TODO: kick the player for session locking!
		});

		// TODO: load data something like that
		return Result.ok(profile);
	}
}
