import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { Option, Result } from "@rbxts/rust-classes";
import { HttpService, Players } from "@rbxts/services";
import { LotService } from "server/services/game/LotService";
import { LotAttributes, LotErrors, LotModel } from "types/game/lot";

@Component({ tag: "Lot" })
export class Lot extends BaseComponent<LotAttributes, LotModel> implements OnStart {
  private logger!: Logger;

  public constructor(private lotService: LotService) {
    super();
  }

  /** @hidden */
  public onStart() {
    this.setAttribute("ComponentId", HttpService.GenerateGUID(false));
    this.logger = Log.ForContext(this);
  }

  /**
   * Returns the following format: `Lot<{ID}>`.
   *
   * Useful for test debugging.
   */
  public toString() {
    return `Lot<${this.attributes.ComponentId}>`;
  }

  /** Attemps to clear the ownership of the tycoon */
  public clearOwner(): Result<true, LotErrors> {
    this.logger.Info("Attempting to remove lot's owner", this.attributes.ComponentId!);
    return this.getOwner().match(
      () => {
        // bye, bye!
        this.attributes.Owner = undefined;
        return Result.ok(true);
      },
      () => Result.err(LotErrors.ClearOwnership),
    );
  }

  /** Setups the player after the ownership */
  public setupOwner(new_owner: Player) {
    // assign player's spawn to the lot's spawn
    new_owner.RespawnLocation = this.instance.Spawn;
  }

  /** Attempts to assign `player` for the new owner of that lot */
  public assignOwner(player: Player): Result<true, LotErrors> {
    this.logger.Info("Attempting to assign {@Player} to a new lot", player, this.attributes.ComponentId!);
    return this.getOwner().match(
      () => Result.err(LotErrors.LotOwned),
      () =>
        this.lotService.getLotFromPlayer(player).match(
          () => Result.err(LotErrors.PlayerOwned) as Result<true, LotErrors>,
          () => {
            this.attributes.Owner = player.UserId;
            this.lotService.fireOnLotOwned(this);
            task.spawn(() => this.setupOwner(player));
            return Result.ok(true);
          },
        ),
    );
  }

  /** Gets the current owner of the lot */
  public getOwner() {
    return Option.wrap(Players.GetPlayerByUserId(this.attributes.Owner ?? -100));
  }
}
