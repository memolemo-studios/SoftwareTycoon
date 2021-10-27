import { BaseError, SerializedBaseError } from "shared/classes/error";

interface Serialized extends SerializedBaseError {
	id: string;
}

export class SoundManagerError extends BaseError<Serialized> {
	public constructor(public readonly id: string) {
		super(`${id} not found, please provide with 'assetId' or make sure that id exists`);
	}

	public serialize() {
		return {
			message: this.message,
			id: this.id,
		};
	}
}
