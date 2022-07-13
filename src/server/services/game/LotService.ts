import { Components } from "@flamework/components";
import { OnInit, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option, Result } from "@rbxts/rust-classes";
import { Lot } from "server/components/Lot";
import { Functions } from "server/remotes";
import { LotOwnError } from "shared/definitions/errors/lot";
import { serializeResult } from "shared/serde/rust-classes";
import { KickSeverity, PlayerKickHandler } from "shared/singletons/PlayerKickHandler";
import { getRandomArrayMember } from "shared/utils/array";
import { LotAttributes } from "types/game/lot";

/**
 * This service provides basic required methods
 * of handling lots.
 */
@Service({})
export class LotService implements OnInit, OnStart {
  private logger = Log.ForContext(LotService);

  public constructor(
    private readonly components: Components,
    private readonly playerKickHandler: PlayerKickHandler,
  ) {}

  /** @hidden */
  public onInit() {
    Functions.RequestLot.setCallback((player) =>
      serializeResult<LotAttributes["Id"], LotOwnError>(this.assignPlayer(player)),
    );
  }

  /** @hidden */
  public onStart(): void {
    if (this.getAll().isEmpty()) {
      this.logger.Warn("There are no available lots in this server!");
      this.logger.Warn("Beware of potential problems later on.");
    }
  }

  /**
   * Gets lot from the component id.
   * @param id A valid component id to get the lot.
   * @returns Option type whether the lot from the component id
   *          exists or not.
   */
  public getFromComponentId(id: string): Option<Lot> {
    for (const lot of this.getAll()) {
      if (lot.attributes.Id === id) {
        return Option.some<Lot>(lot);
      }
    }
    return Option.none<Lot>();
  }

  /**
   * Assigns player to a random lot according to the server.
   * @returns It will return a lot component id assigned from the server
   *          or `Result::Err` if it fails to assign the lot for the player.
   */
  public assignPlayer(player: Player) {
    // making sure the player is not already owned before
    return this.getFromPlayer(player).match<Result<LotAttributes["Id"], LotOwnError>>(
      (lot) =>
        Result.err<LotAttributes["Id"], LotOwnError>(
          LotOwnError.PlayerOwned({
            lotId: lot.attributes.Id,
          }),
        ),
      () => {
        // it will possibly throw an error from getRandomArrayMember
        let member: Lot | undefined;
        try {
          member = getRandomArrayMember(this.getAll());
        } catch {
          return Result.err<LotAttributes["Id"], LotOwnError>(LotOwnError.UnavailableLots());
        }
        return member!
          .AssignOwner(player)
          .andWith<LotAttributes["Id"]>(() =>
            Result.ok<LotAttributes["Id"], LotOwnError>(member!.attributes.Id),
          );
      },
    );
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
