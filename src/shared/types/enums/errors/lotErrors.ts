import { RunService } from "@rbxts/services";
import { $terrify } from "rbxts-transformer-t";

export enum LotRequestErrors {
	PlayerAlreadyOwned = "LOT_REQ_ERR_1",
	LotAlreadyOwned = "LOT_REQ_ERR_2",
	NoVacantLots = "LOT_REQ_ERR_3",
}

export const isLotRequestErr = $terrify<LotRequestErrors>();

export function lotRequestErrorWrapper(code: LotRequestErrors, isUI = false) {
	switch (code) {
		case LotRequestErrors.PlayerAlreadyOwned:
			if (RunService.IsClient()) return `You've already owned a lot!`;
			return `{Player} already owned a lot!`;
		case LotRequestErrors.NoVacantLots:
			let output = `There are no available lots in this server`;
			if (isUI) {
				// friendlier version
				output += `, please rejoin`;
			}
			return output;
		case LotRequestErrors.LotAlreadyOwned:
			return `This lot is already owned by someone else`;
		default:
			return `Unexpected text while trying to retrieve lot request error`;
	}
}
