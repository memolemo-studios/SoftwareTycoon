import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { LotAttributes, LotModel } from "types/game/lot";

@Component({})
export class SharedLot extends BaseComponent<LotAttributes, LotModel> implements OnStart {
	/** @hidden */
	public onStart() {
		// typescript requires it for an odd reason...
	}

	/**
	 * Gets the Player class from the lot's owner attribute
	 *
	 * `Option.none()` -> if the lot is vacant.
	 * `Option.some()` -> if the lot is owned
	 * @returns Option
	 */
	public getOwner(): Option<Player> {
		return Option.wrap(Players.GetPlayerByUserId(this.attributes.Owner ?? -10));
	}
}
