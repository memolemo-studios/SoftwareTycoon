import { Components } from "@flamework/components";
import { Service } from "@flamework/core";
import { Option } from "@rbxts/rust-classes";
import { Lot } from "server/components/Lot";
import { KickSeverity, PlayerKickService } from "../players/PlayerKickService";

/**
 * This service provides basic required methods
 * of handling lots.
 */
@Service({})
export class LotService {
  public constructor(
    private readonly components: Components,
    private readonly playerKickService: PlayerKickService,
  ) {}

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
      this.playerKickService.KickSafe(
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
