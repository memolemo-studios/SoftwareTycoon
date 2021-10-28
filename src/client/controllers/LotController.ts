import { Components } from "@flamework/components";
import { Controller, OnStart } from "@flamework/core";
import { ResultSer } from "@memolemo-studios/result-option-ser";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { ClientLot } from "client/components/ClientLot";
import { Functions } from "client/networking";
import { LotRequestError } from "shared/errors/lotRequest";

const local_player = Players.LocalPlayer;

@Controller({})
export class LotController implements OnStart {
	private logger = Log.ForContext(LotController);

	/** @hidden */
	public async onStart() {
		// log
		this.logger.Info("Requesting lot");

		// request to claim a lot
		const result = ResultSer.deserialize(await this.requestLot());
		if (result.isErr()) {
			// deserialize the error though
			const request_error = LotRequestError.fromSerialized(result.unwrapErr());
			this.logger.Warn("[LotController::onStart]: {Message}", request_error.toMessage());
		} else {
			this.logger.Info("Success!");
		}
	}

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
	 * Requests a lot and sends it over to the server to process it
	 */
	public requestLot() {
		return Functions.requestLot();
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
