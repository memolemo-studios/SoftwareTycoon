import { Component } from "@flamework/components";
import { Result } from "@rbxts/rust-classes";
import { HttpService } from "@rbxts/services";
import { LotService } from "server/services/game/LotService";
import { BaseLot } from "shared/components/Lot";
import { LotOwnError } from "shared/definitions/errors/lot";
import { errOrElse } from "shared/utils/result";
import { ComponentTags } from "types/game/components";
import { LotAttributes } from "types/game/lot";

@Component({
  tag: ComponentTags.Lot,
  defaults: identity<Partial<LotAttributes>>({
    Id: HttpService.GenerateGUID(false),
    Owner: undefined,
  }),
})
export class Lot extends BaseLot {
  public constructor(private readonly lotService: LotService) {
    super();
  }

  /**
   * Inner wrapper of `ClearOwner` that takes care
   * of clearing up the owner.
   */
  private clearOwner() {
    this.attributes.Owner = undefined;
  }

  /**
   * Inner wrapper of `AssignOwner` that takes care
   * of owning the lot even further.
   */
  private assignOwner(player: Player) {
    this.attributes.Owner = player.UserId;
    this.OnOwned.fire(player);
  }

  /**
   * Attempts to clear the ownership of the lot.
   */
  public ClearOwner(): Result<[], LotOwnError> {
    this.logger.Info("Attempting to remove owner");
    return this.GetOwner().match(
      () => {
        this.clearOwner();
        return Result.ok<[], LotOwnError>([]);
      },
      () => Result.err<[], LotOwnError>(LotOwnError.ClearedOwner()),
    );
  }

  /**
   * Attempts to assign a player from the parameter
   * as a new owner of the lot.
   * @param player Player to claim the lot
   */
  public AssignOwner(player: Player): Result<[], LotOwnError> {
    this.logger.Info("Attempting to assign owner to {@Player}", player);
    // @ts-ignore
    return errOrElse<Player, LotOwnError>(this.GetOwner(), (owner) =>
      LotOwnError.LotOwned({
        ownerId: owner.UserId,
      }),
    ).and(
      this.lotService.getFromPlayer(player).match(
        (lot) => Result.err(LotOwnError.PlayerOwned({ lotId: lot.attributes.Id })),
        () => {
          this.assignOwner(player);
          return Result.ok([]);
        },
      ),
    );
  }
}
