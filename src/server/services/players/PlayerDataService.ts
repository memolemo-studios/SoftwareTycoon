import { OnInit, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { GetProfileStore } from "@rbxts/profileservice";
import { Result } from "@rbxts/rust-classes";
import { Players, RunService } from "@rbxts/services";
import variantModule, { variant, VariantOf } from "@rbxts/variant";
import { DEFAULT_PLAYER_DATA } from "shared/definitions/player";
import { DataProfile } from "types/player";
import { KickSeverity, PlayerKickService } from "./PlayerKickService";

/**
 * There are variants of reasons why the player's data failed to load.
 *
 * **About these variants**:
 *
 * `FailedToLoad` 	- Caused by ProfileService cannot load player's profile.
 * `PlayerLeft` 	- Caused by letting the player leave while loading their profile.
 */
export const DataLoadError = variantModule({
  FailedToLoad: variant("FailedToLoad"),
  PlayerLeft: variant("PlayerLeft"),
});

export type DataLoadError = VariantOf<typeof DataLoadError>;

/**
 * This service is responsible for managing ProfileStores
 * and loads the player's profile whenever if it is required to.
 */
@Service({})
export class PlayerDataService implements OnInit {
  private profileStore = GetProfileStore("PlayerData", DEFAULT_PLAYER_DATA);
  private logger = Log.ForContext(PlayerDataService);

  public constructor(private readonly playerKickService: PlayerKickService) {}

  /** @hidden */
  public onInit(): void | Promise<void> {
    // to avoid data disasters even if we accidentally
    // do something in our production game.
    if (RunService.IsStudio()) {
      this.profileStore = this.profileStore.Mock;
    }
  }

  /**
   * Wrapper of `PlayerKickService::KickSafe` but it is
   * configured for data loading error.
   *
   * @param player Player to kick from the game
   * @param err Either the variant of DataLoadError or unique string
   */
  public KickPlayerWithErr(player: Player, err: DataLoadError | string) {
    // a variable to display a message to the log, we want to avoid
    // showing the actual error of unknown error.
    let logMessage: string;
    let kickMessage: string;
    if (typeIs(err, "string")) {
      logMessage = err;
      kickMessage = "internal error from PlayerDataService::LoadProfileAsync";
    } else {
      logMessage = err.type;
      kickMessage = logMessage;
    }
    this.logger.Error("Cannot load profile for {@Player}: {Error}", player, logMessage);
    this.playerKickService.KickSafe(player, KickSeverity.FailedButFixable, kickMessage);
  }

  /**
   * Generates a message with `DataLoadError` variant.
   * @param err Error to generate a message
   */
  public GenerateMessageFromErr(err: DataLoadError) {
    switch (err.type) {
      case "FailedToLoad":
        return "Your data cannot load properly. Please rejoin.";
      case "PlayerLeft":
        return "You should have gone left the game. Please rejoin";
    }
  }

  /**
   * Attempts to load player's profile.
   *
   * It returns a promise and it will resolve when the
   * profile is loaded successfully.
   *
   * Instead of returning it as a player profile like most
   * typical games. It returns a Result that can be identified
   * if it had gone wrong or succeed.
   *
   * ```ts
   * (await this.playerDataService.LoadProfileAsync(player)).match(
   *		(profile) => {
   *			print(profile.Data);
   * 		},
   * 		(err) => print(`Failed to load profile: ${err}`),
   * );
   * ```
   *
   * ## Rejection
   * There is no possible case of rejection aside from bugs where
   * it is in the code.
   *
   * @param player Player to load their profile in
   * @returns A promise with Result type possibly contains the player profile.
   */
  public async LoadProfileAsync(player: Player): Async<Result<DataProfile, DataLoadError>> {
    // generating profile key
    const profileKey = "player_%d".format(player.UserId);
    const profile = this.profileStore.LoadProfileAsync(profileKey);

    // player's profile could not be loaded for some reason
    if (!profile) return Result.err<DataProfile, DataLoadError>(DataLoadError.FailedToLoad());

    // player probably left the game while
    // their profile is loading at that time
    if (!player.IsDescendantOf(Players))
      return Result.err<DataProfile, DataLoadError>(DataLoadError.PlayerLeft());

    // gdpr (right to removal) compliance
    profile.AddUserId(player.UserId);
    profile.Reconcile();

    return Result.ok<DataProfile, DataLoadError>(profile);
  }
}
