import { Dependency, Service } from "@flamework/core";
import Log from "@rbxts/log";
import ProfileService from "@rbxts/profileservice";
import { Result } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { DefaultPlayerData } from "shared/data/defaults";
import { PlayerDataProfile } from "shared/data/types";
import { PlayerDataErrors } from "shared/types/enums/errors/dataErrors";
import { PlayerKickService } from "./PlayerKickService";

@Service({})
export class PlayerDataService {
	private logger = Log.ForContext(PlayerDataService);
	private profileStore = ProfileService.GetProfileStore("PlayerData", DefaultPlayerData);

	private kickService = Dependency<PlayerKickService>();

	public async loadPlayerProfile(player: Player): Promise<Result<PlayerDataProfile, PlayerDataErrors>> {
		const data_key = tostring(player.UserId);
		const profile = this.profileStore.LoadProfileAsync(data_key, "ForceLoad");

		// profile couldn't be loaded possibly due to roblox servers
		if (profile === undefined) {
			// TODO: Kick that player
			this.logger.Info(`Failed to load profile (key: ${data_key})`);
			return Result.err(PlayerDataErrors.ProfileNotLoaded);
		}

		// the player left before the profile could be loaded
		if (!player.IsDescendantOf(Players)) {
			profile.Release();
			return Result.err(PlayerDataErrors.PlayerLeftGame);
		}

		// fill in missing values from default data
		profile.Reconcile();

		// gdpr compliance
		profile.AddUserId(player.UserId);

		// session locking
		profile.ListenToRelease(() => {
			if (!player.IsDescendantOf(Players)) return;

			// kick the player for session locking!
			this.kickService.kickPlayerForError(player, PlayerDataErrors.SessionLocked);
		});

		return Result.ok(profile);
	}
}
