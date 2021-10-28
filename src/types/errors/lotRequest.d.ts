import { BaseSerializedError } from "./base";

export const enum LotRequestErrorKind {
	PlayerAlreadyOwned = "LOT_REQ_ERR_1",
	LotAlreadyOwned = "LOT_REQ_ERR_2",
	NoVacantLots = "LOT_REQ_ERR_3",
	LotAlreadyNotOwned = "LOT_REQ_ERR_4",
}

export interface LotRequestSerializedError extends BaseSerializedError {
	kind: LotRequestErrorKind;
	id?: string;
	stack: string;
	source: string;
}
