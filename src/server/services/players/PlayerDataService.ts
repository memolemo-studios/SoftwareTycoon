import { OnInit, Service } from "@flamework/core";
import { GetProfileStore } from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { Players } from "@rbxts/services";
import { DEFAULT_PLAYER_DATA } from "shared/definitions/game";
import { GameFlags } from "shared/flags";
import { PlayerData } from "types/game/data";
import { PlayerKickReasons, PlayerKickService } from "./PlayerKickService";

export type PlayerDataProfile = Profile<PlayerData>;

@Service({})
export class PlayerDataService implements OnInit {
  private profileStore = GetProfileStore(GameFlags.PlayerProfileStoreName, DEFAULT_PLAYER_DATA);

  public constructor(private kickService: PlayerKickService) {}

  /** @hidden */
  public onInit() {
    // game flag setup
    if (GameFlags.UseMockStore) {
      this.profileStore = this.profileStore.Mock;
    }
  }

  /** Joins with data prefix and suffix with the user id argument provided */
  public makeDataKeyFromId(id: string | number) {
    return `${GameFlags.PlayerDataKeyPrefix}${id}${GameFlags.PlayerDataKeySuffix}`;
  }

  /** Tries to load player's profile from ProfileService */
  public async loadPlayerProfile(player: Player) {
    // create a generated data key from makeDataKeyFromId method
    const data_key = this.makeDataKeyFromId(player.UserId);
    const profile = this.profileStore.LoadProfileAsync(data_key, "ForceLoad");

    // the profile possibly couldn't be loaded
    if (profile === undefined) {
      return this.kickService.kickPlayerWithReason(player, PlayerKickReasons.DataNotLoaded);
    }

    // the player possibly left the game before the profile could be loaded
    if (!player.IsDescendantOf(Players)) {
      return profile.Release();
    }

    // GDPR compliance (right to forgotten?)
    profile.AddUserId(player.UserId);

    // TODO: Data migration feature
    // fill in missing values from default data
    profile.Reconcile();

    // listen for when the profile releases
    profile.ListenToRelease(() => {
      this.kickService.kickPlayerWithReason(player, PlayerKickReasons.ProfileReleased);
    });

    return profile;
  }
}
