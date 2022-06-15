import { BaseComponent } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Signal } from "@rbxts/beacon";
import { Bin } from "@rbxts/bin";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { LotAttributes, LotModel } from "types/game/lot";

/**
 * This is a shared base class to cover methods which can be
 * executed both server and client.
 *
 * It is served as a base class to avoid code duplication.
 */
export class BaseLot extends BaseComponent<LotAttributes, LotModel> implements OnStart {
  protected bin = new Bin();
  protected logger = Log.ForContext(BaseLot);

  /**
   * This signal invokes when a new owner claims the lot.
   * @param newOwner New owner of the lot
   */
  public readonly OnOwned = new Signal<[newOwner?: Player]>();

  /**
   * Gets the current lot owner's `Player` object by using
   * the builtin ROBLOX method: `Players:GetPlayerByUserId`.
   *
   * It will return `None` if it returns a nil value in this builtin method,
   * otherwise return it as `Some`
   */
  public GetOwner() {
    return Option.wrap(Players.GetPlayerByUserId(this.attributes.Owner ?? -1000));
  }

  /**
   * Converts this object into a meaningful string
   * inside.
   *
   * ```ts
   * // Assume the id is 'Sample'
   * const string = lot.toString();
   * assert(string == "Lot<Sample>");
   * ```
   *
   * Its purpose is to have custom name for the logger.
   */
  public toString() {
    return `Lot<${this.attributes.Id}>`;
  }

  /** @hidden */
  public onStart() {
    this.bin.add(this.OnOwned);
    this.maid.GiveTask(() => this.bin.destroy());
    this.onAttributeChanged("Owner", (newOwner) => {
      this.OnOwned.fire(Players.GetPlayerByUserId(newOwner ?? -100));
    });
  }
}
