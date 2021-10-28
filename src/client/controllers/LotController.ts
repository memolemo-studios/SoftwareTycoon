import { Components } from "@flamework/components";
import { Controller } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { ClientLot } from "client/components/ClientLot";

const local_player = Players.LocalPlayer;

@Controller({})
export class LotController {
	private logger = Log.ForContext(LotController);

	public constructor(private components: Components) {}

	/**
	 * Gets an owner lot
	 *
	 * `Option.none()` -> If the LocalPlayer doesn't owned a lot
	 *
	 * `Option.some()` -> If the LocalPlayer claimed a lot
	 * @returns Option
	 */
	public getOwnerLot() {
		return this.getLotFromPlayer(local_player);
	}

	/**
	 * Safer version of `LotService::getLotFromPlayer`
	 * but it grabs the entire player's owned lots.
	 *
	 * *Useful for moderation system and so on.*
	 */
	private getLotsFromPlayer(player: Player) {
		return this.components.getAllComponents<ClientLot>().filter(lot => lot.getOwner().contains(player));
	}

	/**
	 * Gets a lot from the player
	 *
	 * `Option.none()` -> if the player doesn't owned a lot before
	 *
	 * `Option.some()` -> if the player owned a lot
	 * @param player
	 * @returns Option
	 */
	public getLotFromPlayer(player: Player): Option<ClientLot> {
		const player_owned_lots = this.getLotsFromPlayer(player);

		// multiple lots cases
		if (player_owned_lots.size() > 1) {
			this.logger.Warn("{Player} owned more than 2 lots, choosing one only", player.UserId);
			return Option.some(player_owned_lots[0]);
		}

		return Option.wrap(player_owned_lots[0]);
	}
}
