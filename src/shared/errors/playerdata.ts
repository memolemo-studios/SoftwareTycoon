import { $terrify } from "rbxts-transformer-t";
import { PlayerDataErrorKind, PlayerDataSerializedError } from "types/errors/playerdata";
import BaseError from "./base";

const enum_check = $terrify<PlayerDataErrorKind>();
const serialized_check = $terrify<PlayerDataSerializedError>();

function toMessageFromKind(kind: PlayerDataErrorKind) {
	// TODO: to something to that message
	assert(enum_check(kind), "Invalid PlayerDataError kind");
	return "Unknown error";
}

export class PlayerDataError extends BaseError {
	public constructor(public kind: PlayerDataErrorKind, inheritedTimes = 2) {
		super(inheritedTimes);
	}

	public static fromSerialized(serialized: unknown) {
		assert(serialized_check(serialized), "Invalid serialized error");

		// constructing new class
		const new_error = new PlayerDataError(serialized.kind);
		new_error.source = serialized.source;
		new_error.stack = serialized.stack;

		return new_error;
	}

	public serialize(): PlayerDataSerializedError {
		return {
			...super.serialize(),
			kind: this.kind,
		};
	}

	/**
	 * Converts `Error` class to a finalized and formatted error message
	 *
	 * **Expected output:**
	 * ```txt
	 * 04:10:52.940 [PlayerData Error]: any message
	 * Stack Begin
	 * ReplicatedStorage.Game.errors.base:18 function constructor
	 * ReplicatedStorage.Game.errors.base:13 function new
	 * ServerScriptService.Game.runtime:15
	 * Stack End
	 * ```
	 * @returns Error message with traceback
	 */
	public toString() {
		return `[PlayerData Error]: ${toMessageFromKind(this.kind)}\n${this.toStringStack()}`;
	}
}
