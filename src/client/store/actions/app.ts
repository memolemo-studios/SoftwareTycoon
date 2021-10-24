import { Action } from "@rbxts/rodux";
import { AppState } from "shared/types/enums/store/apps";

export interface SetAppStateAction extends Action<"set_app_state"> {
	newState: AppState;
}
