import { isLotRequestErr, lotRequestErrorWrapper } from "shared/types/enums/errors/lotErrors";
import { isRemoteRequestErr, remoteRequestErrWrapper } from "shared/types/enums/errors/remote";

export function gameErrorsWrapper(code: unknown): string {
	if (isRemoteRequestErr(code)) {
		return remoteRequestErrWrapper(code);
	} else if (isLotRequestErr(code)) {
		return lotRequestErrorWrapper(code);
	}
	return `Unknown error`;
}
