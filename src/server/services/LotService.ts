import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import { ResultSer } from "@memolemo-studios/result-option-ser";
import Log from "@rbxts/log";
import { Option, Result } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { ServerLot } from "server/components/game/ServerLot";
import { Functions } from "server/networking";
import { LotRequestError } from "shared/errors/lotRequest";
import ArrayUtil from "shared/util/array";
import { LotRequestErrorKind, LotRequestSerializedError } from "types/errors/lotRequest";

@Service({})
export class LotService implements OnStart {
	private logger = Log.ForContext(LotService);

	/** @hidden */
	public onStart() {
		// if lots are empty, warn the server
		if (this.components.getAllComponents<ServerLot>().isEmpty()) {
			this.logger.Warn("This server has no available lots, avoid requesting lot as possible to prevent issues");
		}

		// when the player leaves the game
		Players.PlayerRemoving.Connect(player => this.onPlayerLeft(player));

		// connecting some functions
		Functions.requestLot.setCallback(player => {
			return ResultSer.serialize<string, LotRequestSerializedError>(
				this.assignPlayerToLot(player).match(
					lot => Result.ok(lot.attributes.Id!),
					err => Result.err(err.serialize()),
				),
			);
		});
	}

	public constructor(private components: Components) {}

	/**
	 * Gets all of the vacants from the rest of the server
	 * @returns Collection of vacant lots
	 */
	public getVacantLots() {
		return this.components.getAllComponents<ServerLot>().filter(lot => lot.getOwner().isNone());
	}

	/**
	 * Claiming a player to a random lot
	 *
	 * `Result.ok()` -> If the player doesn't own a lot or  lot doesn't claimed
	 *
	 * `Result.err()` -> There's something wrong when claiming lot
	 *
	 * @param player Player to own a random lot
	 * @returns Option
	 */
	public assignPlayerToLot(player: Player): Result<ServerLot, LotRequestError> {
		// make sure that player doesn't claimed a lot or multiple
		const lot_player_opt = this.getLotFromPlayer(player);
		if (lot_player_opt.isSome()) {
			return Result.err(LotRequestError.fromLot(LotRequestErrorKind.PlayerAlreadyOwned, lot_player_opt.unwrap()));
		}

		// get a random vacant lot, if possible
		const random_vacant_opt = ArrayUtil.getRandomMember(this.getVacantLots());
		if (random_vacant_opt.isNone()) {
			return Result.err(LotRequestError.fromLot(LotRequestErrorKind.NoVacantLots));
		}

		// claiming process
		const vacant_lot = random_vacant_opt.unwrap();
		const result = vacant_lot.assignOwner(player);
		if (result.isErr()) {
			return Result.err(result.unwrapErr());
		}

		return Result.ok(vacant_lot);
	}

	/**
	 * Safer version of `LotService::getLotFromPlayer`
	 * but it grabs the entire player's owned lots.
	 *
	 * *Useful for moderation system and so on.*
	 */
	private getLotsFromPlayer(player: Player) {
		return this.components.getAllComponents<ServerLot>().filter(lot => lot.getOwner().contains(player));
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
	public getLotFromPlayer(player: Player): Option<ServerLot> {
		const player_owned_lots = this.getLotsFromPlayer(player);

		// multiple lots cases
		if (player_owned_lots.size() > 1) {
			this.logger.Warn("{Player} owned more than 2 lots!!!", player.UserId);
			player.Kick("Suspicious activity!");
			return Option.none();
		}

		return Option.wrap(player_owned_lots[0]);
	}

	private onPlayerLeft(player: Player) {
		for (const lot of this.getLotsFromPlayer(player)) {
			const clear_result = lot.clearOwner();
			if (clear_result.isErr()) {
				this.logger.Error(clear_result.unwrapErr().toMessage());
			}
		}
	}
}
