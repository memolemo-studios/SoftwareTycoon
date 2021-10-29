import { $terrify } from "rbxts-transformer-t";
import { LatencyRequestErrorKind, LatencyRequestSerializedError } from "types/errors/latency";
import BaseError from "./base";

const enum_check = $terrify<LatencyRequestErrorKind>();
const serialized_check = $terrify<LatencyRequestSerializedError>();

function toMessageFromKind(kind: LatencyRequestErrorKind) {
	// TODO: to something to that message
	assert(enum_check(kind), "Invalid PlayerDataError kind");
	return "unknown message error";
}

export class LatencyRequestError extends BaseError {
	public constructor(public kind: LatencyRequestErrorKind, inheritedTimes = 2) {
		super(inheritedTimes);
	}

	public toMessage() {
		return toMessageFromKind(this.kind);
	}

	public static fromSerialized(serialized: unknown) {
		assert(serialized_check(serialized), "Invalid serialized error");

		// a workaround to solve this problem here
		const ser = serialized as unknown as LatencyRequestSerializedError;

		// constructing new class
		const new_error = new LatencyRequestError(ser.kind);
		new_error.source = ser.source;
		new_error.stack = ser.stack;

		return new_error;
	}

	public serialize(): LatencyRequestSerializedError {
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
	 * 04:10:52.940 [Latency Request Error]: any message
	 * Stack Begin
	 * ReplicatedStorage.Game.errors.base:18 function constructor
	 * ReplicatedStorage.Game.errors.base:13 function new
	 * ServerScriptService.Game.runtime:15
	 * Stack End
	 * ```
	 * @returns Error message with traceback
	 */
	public toString() {
		return `[Latency Request Error]: ${toMessageFromKind(this.kind)}\n${this.toStringStack()}`;
	}
}
