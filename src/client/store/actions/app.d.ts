import { Action } from "@rbxts/rodux";
import { AppState } from "types/store/app";

export interface SetAppStateAction extends Action<"set_app_state"> {
	newState: AppState;
}
