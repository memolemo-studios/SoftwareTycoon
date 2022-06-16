import { Components } from "@flamework/components";
import { Controller, Dependency } from "@flamework/core";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { Lot } from "client/components/Lot";

const LocalPlayer = Players.LocalPlayer;

@Controller({})
export class LotController {
  private readonly components = Dependency<Components>();

  /**
   * Gets the client player's lot if it does exists.
   *
   * ## Security
   * We cannot verify the current lot in the client are coming from the server
   * or created by an unknown source (which case is an exploiter).
   *
   * **Make sure to verify further if you want to get the information of the current lot.**
   *
   * @returns Lot wrapped with Option
   */
  public get(): Option<Lot> {
    const playerLots = this.getAll().filter((lot) => lot.GetOwner().contains(LocalPlayer));
    if (playerLots.size() > 1) {
      LocalPlayer.Kick("Too many lots");
      return Option.none<Lot>();
    }
    // @ts-ignore
    return Option.wrap(playerLots[0]);
  }

  /**
   * Gets all of the lots available in the game session.
   *
   * ## Security
   * We cannot verify all lots in the client are coming from the server
   * or created by an unknown source (which case is an exploiter).
   *
   * **Make sure to verify further if you want to get the information
   * of every each lot.**
   *
   * @returns A collection of lots available in the game session.
   */
  public getAll() {
    return this.components.getAllComponents<Lot>();
  }
}
