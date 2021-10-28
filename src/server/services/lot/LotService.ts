import { Components } from "@flamework/components";
import { OnInit, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option, Result } from "@rbxts/rust-classes";
import { ServerLot } from "server/components/game/ServerLot";
import { LotRequestError } from "shared/errors/lotRequest";
import ArrayUtil from "shared/util/array";
import { LotRequestErrorKind } from "types/errors/lotRequest";

@Service({})
export class LotService implements OnInit {
	private logger = Log.ForContext(LotService);

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
		return this.getLotFromPlayer(player).match(
			lot => Result.err(LotRequestError.fromLot(LotRequestErrorKind.PlayerAlreadyOwned, lot)),
			() => {
				return ArrayUtil.getRandomMember(this.getVacantLots()).match(
					lot => {
						const result = lot.assignOwner(player);
						return result.isErr() ? Result.err(result.unwrapErr()) : Result.ok(lot);
					},
					() => Result.err(LotRequestError.fromLot(LotRequestErrorKind.NoVacantLots)),
				);
			},
		);
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
		const player_owned_lots = this.components
			.getAllComponents<ServerLot>()
			.filter(lot => lot.getOwner().contains(player));

		// multiple lots cases
		if (player_owned_lots.size() > 1) {
			this.logger.Warn("{Player} owned more than 2 lots!!!");
			player.Kick("Suspicious activity!");
			return Option.none();
		}

		return Option.wrap(player_owned_lots[0]);
	}

	/** @hidden */
	public onInit() {}
}
