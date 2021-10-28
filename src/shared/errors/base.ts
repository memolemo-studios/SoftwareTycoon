import { $terrify } from "rbxts-transformer-t";
import { BaseSerializedError } from "types/errors/base";

const serialized_check = $terrify<BaseSerializedError>();

/** Base class of an game error */
export default class BaseError {
	public stack: string;
	public source: string;

	public constructor(inheritedTimes = 1) {
		this.stack = debug.traceback();

		// https://twitter.com/zeuxcg/status/1403443231103148034
		this.source = debug.info(2 * inheritedTimes + 1, "s")[0];
	}

	/**
	 * Makes an error class based on the serialized object
	 *
	 * The reason I didn't put parameter type for Serialized expect
	 * for seriously typed objects because of type security.
	 *
	 * @returns Error class, if it is successfully passed on typecheck process
	 */
	public static fromSerialized(serialized: unknown) {
		assert(serialized_check(serialized), "Invalid serialized error");

		// constructing new class
		const new_error = new BaseError();
		new_error.source = serialized.source;
		new_error.stack = serialized.stack;

		return new_error;
	}

	/**
	 * Serializes error for remote communication
	 *
	 * @returns Serialized object for any Error class
	 */
	public serialize(): BaseSerializedError {
		return {
			stack: this.stack,
			source: this.source,
		};
	}

	/**
	 * Converts stack to formatted sack
	 *
	 * This is a lazy function so that I don't have to write
	 * the same thing in toString method
	 */
	public toStringStack() {
		return `Stack Begin\n${this.stack}Stack End`;
	}

	/**
	 * Converts `Error` class to a finalized and formatted error message
	 *
	 * **Expected output:**
	 * ```txt
	 * 04:10:52.940 Error occurred!
	 * Stack Begin
	 * ReplicatedStorage.Game.errors.base:18 function constructor
	 * ReplicatedStorage.Game.errors.base:13 function new
	 * ServerScriptService.Game.runtime:15
	 * Stack End
	 * ```
	 * @returns Error message with traceback
	 */
	public toString() {
		return `Error occurred!\n${this.toStringStack()}`;
	}
}
