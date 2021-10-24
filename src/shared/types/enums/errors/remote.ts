import { t } from "@rbxts/t";
import { $terrify } from "rbxts-transformer-t";

export enum RemoteRequestErrors {
	Timeout = "REMOTE_ERR_TIMEOUT",
	DeserializationError = "REMOTE_DESERIALIZATION_ERR",
}

export const isRemoteRequestErr = $terrify<RemoteRequestErrors>() as t.check<RemoteRequestErrors>;

// error in typescript...
export function remoteRequestErrWrapper(code: RemoteRequestErrors) {
	switch (code) {
		case RemoteRequestErrors.Timeout:
			return `Remote timeout`;
		default:
			return `Unexpected text while trying to retrieve remote request error`;
	}
}
