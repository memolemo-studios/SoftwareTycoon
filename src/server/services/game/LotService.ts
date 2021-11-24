import { Components } from "@flamework/components";
import { Flamework, OnInit, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option, Result } from "@rbxts/rust-classes";
import { Lot } from "server/components/lot";
import Remotes from "shared/remotes/game";
import { FlameworkUtil } from "shared/utils/flamework";
import { ResponseUtil } from "shared/utils/response";
import { LotErrors } from "types/game/lot";
import { OnPlayerLeft } from "../players/PlayerService";

/** Hook into the OnLotOwned event */
export interface OnLotOwned {
  /**
   * This function will be called whenever the player owns their desired lot.
   *
   * This should only used if you want to have extra functionality after
   * the player owns their own lot.
   */
  onLotOwned(lot: Lot, newOwner: Player): void;
}

const rng = new Random();

@Service({})
export class LotService implements OnPlayerLeft, OnInit, OnStart {
  private logger = Log.ForContext(LotService);
  private lotOwnedObjs!: Map<string, OnLotOwned>;

  private requestLotRemote = Remotes.Server.Create("RequestLot");

  public constructor(private components: Components) {}

  /** @hidden */
  public onInit() {
    // hook events
    this.lotOwnedObjs = FlameworkUtil.getDependencySingletons(ctor => Flamework.implements<OnLotOwned>(ctor));

    // connecting events stuff
    this.requestLotRemote.SetCallback(plr => {
      return ResponseUtil.makeFromResult(this.assignRandomLotToPlayer(plr));
    });
  }

  /** @hidden */
  public onStart() {
    // warn the server, if there are no available lots
    if (!this.areLotsAvailable()) {
      this.logger.Warn("There are no available lots in the server");
    }
  }

  /** @hidden */
  public onPlayerLeft(player: Player) {
    // get the player's lot
    const lot_opt = this.getLotFromPlayer(player);
    if (lot_opt.isNone()) return;

    // unwrap the option and clear the ownership
    const lot = lot_opt.unwrap();
    const result = lot.clearOwner();
    if (result.isErr()) {
      this.logger.Info("Failed to unassign ownership {@Player}'s lot (Error code: {Code})", result.unwrapErr());
    } else {
      this.logger.Info("Unassigning lot ownership done!");
    }
  }

  /** Gets a lot from the component id */
  public getLotFromComponentId(id: string) {
    for (const lot of this.getAllLots()) {
      if (lot.attributes.ComponentId === id) {
        return Option.some(lot);
      }
    }
    return Option.none<Lot>();
  }

  /** This method returns if lots are not available in the server */
  public areLotsAvailable() {
    return !this.getAllLots().isEmpty();
  }

  /** Gets an array of vacant lots */
  public getVacantLots() {
    return this.getAllLots().filter(v => v.getOwner().isNone());
  }

  /** Gets a random vacant lot available */
  public getRandomVacantLot() {
    const vacant_lots = this.getVacantLots();
    return Option.wrap(vacant_lots[rng.NextInteger(0, vacant_lots.size() - 1)]);
  }

  /** Assigns a random vacant to a targeted player */
  public assignRandomLotToPlayer(player: Player): Result<string, LotErrors> {
    return this.getRandomVacantLot().match(
      lot => this.assignLotToPlayer(lot, player).map(() => lot.attributes.ComponentId!),
      () => Result.err(LotErrors.NoLots),
    );
  }

  /** Assigns lot to a targeted player */
  public assignLotToPlayer(lot: Lot, player: Player) {
    return lot.assignOwner(player);
  }

  /**
   * Fires `OnLotOwned` event hook.
   *
   * **BE CAREFUL**: This method is dangerous (and hidden)
   * because it would have serious issues.
   * @hidden
   */
  public fireOnLotOwned(lot: Lot) {
    const owner = lot.getOwner().expect(`[${lot.attributes.ComponentId!}]: Expected owner in lot`);
    for (const [, obj] of this.lotOwnedObjs) {
      task.spawn(() => obj.onLotOwned(lot, owner));
    }
  }

  /** Gets all of the lot available in the server */
  public getAllLots() {
    return this.components.getAllComponents<Lot>();
  }

  /** Gets the player's current lot (if possible) */
  public getLotFromPlayer(player: Player): Option<Lot> {
    for (const lot of this.getAllLots()) {
      if (lot.getOwner().contains(player)) {
        return Option.some(lot);
      }
    }
    return Option.none();
  }
}
