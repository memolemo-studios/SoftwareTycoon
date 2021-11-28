import { Service } from "@flamework/core";
import Log from "@rbxts/log";

export const enum PlayerKickReasons {
  Exploit = 1,
  DataNotLoaded = 2,
  ProfileReleased = 3,
  DataMigrationFailed = 4,
}

@Service({})
export class PlayerKickService {
  private logger = Log.ForContext(PlayerKickService);

  /**
   * Translates from reason enum member to a
   * simplified meaningful messages depending on the
   * point of view
   * @param pov Point of view to change message with
   */
  public toMessage(pov: "Player" | "Server", reason: PlayerKickReasons) {
    switch (pov) {
      case "Player":
        switch (reason) {
          case PlayerKickReasons.Exploit:
            return "You're suspiciously exploited the game!";
          case PlayerKickReasons.DataNotLoaded:
            return "Unable to load saved data. Please rejoin.";
          case PlayerKickReasons.ProfileReleased:
            return "Your data has been loaded remotely. Please rejoin.";
          case PlayerKickReasons.DataMigrationFailed:
            return "The game tried to convert your old data to new data but it fails. Please contact the developer immediately!";
          default:
            return "Unexpected error (UNKNOWN ERROR TYPE)";
        }
      case "Server":
        switch (reason) {
          case PlayerKickReasons.Exploit:
            return "{@Player} got kicked because of exploiting!";
          case PlayerKickReasons.DataNotLoaded:
            return "{@Player} unable to load their data.";
          case PlayerKickReasons.ProfileReleased:
            return "{@Player} loaded their data from the other server";
          case PlayerKickReasons.DataMigrationFailed:
            return "{@Player}'s data have gone wrong when migrating to a new version.";
          default:
            error(`Invalid reason: ${reason}`);
        }
      default:
        error(`Invalid pov`);
    }
  }

  /**
   * Kicks the player out of the server with a reason
   * @param player A player object to kick to
   * @param reason A reason why the player kicked
   */
  public kickPlayerWithReason(player: Player, reason: PlayerKickReasons) {
    this.logger.Info(this.toMessage("Server", reason), player);
    player.Kick(this.toMessage("Player", reason));
  }
}
