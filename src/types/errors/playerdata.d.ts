import { BaseSerializedError } from "./base";

export const enum PlayerDataErrorKind {}

export interface PlayerDataSerializedError extends BaseSerializedError {
	kind: PlayerDataErrorKind;
	stack: string;
	source: string;
}
