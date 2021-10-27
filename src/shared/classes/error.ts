export interface SerializedBaseError {
	message: string;
}

export abstract class BaseError<Serialized extends SerializedBaseError> {
	public constructor(public readonly message: string) {}

	public abstract serialize(): Serialized;
}
