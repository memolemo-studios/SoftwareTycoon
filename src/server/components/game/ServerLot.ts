import { OnInit } from "@flamework/core";
import { Component } from "@flamework/components";
import { SharedLot } from "shared/components/game/SharedLot";
import { Result } from "@rbxts/rust-classes";
import { LotRequestError } from "shared/errors/lotRequest";
import { LotRequestErrorKind } from "types/errors/lotRequest";
import { HttpService } from "@rbxts/services";

@Component({})
export class ServerLot extends SharedLot implements OnInit {
	/** @hidden */
	public onInit() {
		this.attributes.Id = HttpService.GenerateGUID(false);
	}

	/**
	 * Clears the lot's owner
	 *
	 * **NOTE**: This lot must be owned before clearing it
	 * otherwise it will returned as a Result error.
	 * @returns Result
	 */
	public clearOwner(): Result<true, LotRequestError> {
		return this.getOwner().match(
			() => {
				this.attributes.Owner = undefined;
				return Result.ok(true);
			},
			() => Result.err(new LotRequestError(LotRequestErrorKind.LotAlreadyNotOwned, this.attributes.Id!)),
		);
	}

	/**
	 * Assigns that player from the parameter to own the lot
	 *
	 * **NOTE**: This lot must be vacant to claim it otherwise
	 * it will returned as Result error.
	 * @param player
	 * @returns Result
	 */
	public assignOwner(player: Player): Result<true, LotRequestError> {
		return this.getOwner().match(
			() => Result.err(new LotRequestError(LotRequestErrorKind.LotAlreadyOwned, this.attributes.Id!)),
			() => {
				this.attributes.Owner = player.UserId;
				return Result.ok(true);
			},
		);
	}
}
