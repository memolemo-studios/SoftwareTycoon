import { Result } from "@rbxts/rust-classes";
import { t } from "@rbxts/t";
import { $terrify } from "rbxts-transformer-t";
import { SharedLot } from "shared/components/game/SharedLot";
import { LotRequestErrorKind, LotRequestSerializedError } from "types/errors/lotRequest";
import BaseError from "./base";

const enum_check = $terrify<LotRequestErrorKind>();
const serialized_check = $terrify<LotRequestSerializedError>();

function toMessageFromKind(kind: LotRequestErrorKind): string {
	// TODO: to something to that message
	assert(enum_check(kind), "Invalid PlayerDataError kind");
	switch (kind) {
		case LotRequestErrorKind.LotAlreadyNotOwned:
			return "This lot is already not owned!";
		case LotRequestErrorKind.LotAlreadyOwned:
			return "This lot is already owned!";
		case LotRequestErrorKind.PlayerAlreadyOwned:
			// idk what to do with this hehehe
			return "ehhehe";
		case LotRequestErrorKind.NoVacantLots:
			return "There are no available lots";
	}
}

export class LotRequestError extends BaseError {
	public constructor(public kind: LotRequestErrorKind, public id?: string, inheritedTimes = 2) {
		super(inheritedTimes);
	}

	public toMessage() {
		return toMessageFromKind(this.kind);
	}

	public static fromLot(kind: LotRequestErrorKind, lot?: SharedLot) {
		const id = lot?.attributes.Id;
		return new LotRequestError(kind, id);
	}

	public static fromSerialized(serialized: unknown) {
		assert(serialized_check(serialized), "Invalid serialized error");

		// a workaround to solve this problem here
		const ser = serialized as unknown as LotRequestSerializedError;

		// constructing new class
		const new_error = new LotRequestError(ser.kind, serialized.id);
		new_error.source = ser.source;
		new_error.stack = ser.stack;

		return new_error;
	}

	public serialize(): LotRequestSerializedError {
		return {
			...super.serialize(),
			kind: this.kind,
			id: this.id,
		};
	}

	/**
	 * Converts `Error` class to a finalized and formatted error message
	 *
	 * **Expected output:**
	 * ```txt
	 * 04:10:52.940 [LotRequest Error]: any message
	 * Stack Begin
	 * ReplicatedStorage.Game.errors.base:18 function constructor
	 * ReplicatedStorage.Game.errors.base:13 function new
	 * ServerScriptService.Game.runtime:15
	 * Stack End
	 * ```
	 * @returns Error message with traceback
	 */
	public toString() {
		return `[LotRequest Error]: ${toMessageFromKind(this.kind)}\n${this.toStringStack()}`;
	}
}
