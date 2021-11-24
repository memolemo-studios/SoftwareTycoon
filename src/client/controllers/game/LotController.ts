import { Components } from "@flamework/components";
import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { Lot } from "client/components/lot";
import { GameFlags } from "shared/flags";
import Remotes from "shared/remotes/game";
import { lotErrorToString } from "shared/utils/errors";

const local_player = Players.LocalPlayer;

@Controller({})
export class LotController implements OnStart {
  private logger = Log.ForContext(LotController);
  private ownerLot?: Lot;

  public onPlayerOwnedLot = new Signal<(lot: Lot) => void>();

  public constructor(private components: Components) {}

  /** Gets the lot from the component id */
  public getLotFromComponentId(id: string) {
    for (const lot of this.getAllLots()) {
      if (lot.attributes.ComponentId === id) {
        return Option.some(lot);
      }
    }
    return Option.none<Lot>();
  }

  /** Gets the current LocalPlayer's lot */
  public getOwnerLot() {
    return Option.wrap(this.ownerLot);
  }

  /**
   * Tries to request to own a random vacant lot
   * and it returns a new lot component id or none (if there's response error)
   */
  public async requestLot() {
    const request_lot = Remotes.Client.Get("RequestLot");
    try {
      const res = await request_lot.CallServerAsync();
      if (res.success) {
        this.logger.Debug("Requesting lot done! ({NewLotId})", res.value);
        return res.value;
      } else {
        this.logger.Error("Failed to request lot: {Reason}", lotErrorToString(res.reason));
      }
    } catch (reason) {
      this.logger.Error("Failed to request lot: {Reason}", reason);
    }
  }

  /** Gets all of the lots available in the server */
  public getAllLots() {
    return this.components.getAllComponents<Lot>();
  }

  /** @hidden */
  public onStart() {
    // calling for new ownerships!
    for (const lot of this.getAllLots()) {
      // TODO: A secure way to identify for real lot's owner
      // because some exploiters can take an advantage of this
      lot.onAttributeChanged("Owner", new_owner => {
        if (new_owner === local_player.UserId) {
          this.ownerLot = lot;
          this.onPlayerOwnedLot.Fire(lot);
        }
      });
    }

    // request a lot if GameFlags.RequestLotOnStart is enabled
    if (GameFlags.RequestLotOnStart) {
      this.requestLot();
    }
  }
}
