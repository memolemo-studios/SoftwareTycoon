import { BaseSerializedError } from "./base";

export const enum LatencyRequestErrorKind {
	PlayerNotFound = "LATENCY_PLR_NOT_FOUND",
}

export interface LatencyRequestSerializedError extends BaseSerializedError {
	kind: LatencyRequestErrorKind;
	stack: string;
	source: string;
}
