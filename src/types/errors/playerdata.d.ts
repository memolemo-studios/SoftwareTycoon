import { BaseSerializedError } from "./base";

export const enum PlayerDataErrorKind {
	DataNotLoaded = "PLR_DATA_ERR_1",
	ProfileNotLoaded = "PLR_DATA_ERR_2",
	PlayerLeftGame = "PLR_DATA_ERR_3",
}

export interface PlayerDataSerializedError extends BaseSerializedError {
	kind: PlayerDataErrorKind;
	stack: string;
	source: string;
}
