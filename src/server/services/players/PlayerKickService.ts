import { Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Players } from "@rbxts/services";

export const enum KickSeverity {
  FailedButFixable = 0,
  Bug = 1,
}

/**
 * This service handles player kicks.
 */
@Service({})
export class PlayerKickService {
  private logger = Log.ForContext(PlayerKickService);

  /**
   * Kicks the player out of the game with whatever reason and
   * how severe that kick is.
   *
   * If you want to kick the player for violating the guidelines
   * such as exploting, you may want to use `PlayerKickService::ViolationKick`
   * to take care of moderation inside.
   *
   * ```ts
   * // Should say: `Your data cannot load properly. Please rejoin to try again`
   * this.kickWithReason(player, KickSeverity.Expected, "Your data cannot load properly.");
   * ```
   *
   * ```ts
   * // Should say: `This game encountered a bug, please report to our community chat. Message: Oh noes!`
   * this.kickWithReason(player, KickSeverity.Bug, "Oh noes!");
   * ```
   *
   * @param player Player to kick the game from the server
   * @param severity How severe that kick is.
   * @param reason Reason why player got kicked
   */
  public KickSafe(player: Player, severity: KickSeverity, reason: string) {
    let message = "\n\n";
    switch (severity) {
      case KickSeverity.Bug:
        message +=
          "This game encountered a server bug.\n" +
          `Please report to our community chat to resolve the issue.\n\nMessage:\n${reason}`;
        break;
      case KickSeverity.FailedButFixable:
        message += `${reason}.\nPlease rejoin to try again.`;
        break;
    }
    if (player.IsDescendantOf(Players)) {
      this.logger.Info(
        "{@Player} kicked from server with severity {Severity}: {Reason}",
        player,
        severity,
        reason,
      );
      player.Kick(message);
    }
  }
}
