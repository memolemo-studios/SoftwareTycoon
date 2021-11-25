import { Component, BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { LotAttributes, LotModel } from "types/game/lot";

@Component({ tag: "Lot" })
export class Lot extends BaseComponent<LotAttributes, LotModel> implements OnStart {
  private logger!: Logger;

  /** @hidden */
  public onStart() {
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

  /** Gets the current owner of the lot */
  public getOwner() {
    return Option.wrap(Players.GetPlayerByUserId(this.attributes.Owner ?? -100));
  }
}
