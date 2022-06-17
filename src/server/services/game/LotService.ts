import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Lot } from "server/components/Lot";
import { KickSeverity, PlayerKickHandler } from "shared/singletons/PlayerKickHandler";

/**
 * This service provides basic required methods
 * of handling lots.
 */
@Service({})
export class LotService implements OnStart {
  private logger = Log.ForContext(LotService);

  public constructor(
    private readonly components: Components,
    private readonly playerKickHandler: PlayerKickHandler,
  ) {}

  /** @hidden */
  public onStart(): void {
    if (this.getAll().isEmpty()) {
      this.logger.Warn("There are no available lots in this server!");
      this.logger.Warn("Beware of potential problems later on.");
    }
  }

  /**
   * Gets all of the lots available in the game session.
   * @returns A collection of lots available in the game session.
   */
  public getAll() {
    return this.components.getAllComponents<Lot>();
  }

  /**
   * Gets the current player's assigned lot.
   * @param player Player to get their own lot on
   * @returns Option type whether the player has their own lot
   */
  public getFromPlayer(player: Player): Option<Lot> {
    const playerLots = this.getAll().filter((lot) => lot.GetOwner().contains(player));
    if (playerLots.size() > 1) {
      this.playerKickHandler.KickSafe(
        player,
        KickSeverity.Bug,
        "You've owned too many lots than the game expected",
      );
      return Option.none<Lot>();
    }
    // @ts-ignore
    return Option.wrap(playerLots[0]);
  }
}
