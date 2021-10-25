import { createReducer } from "@rbxts/rodux";
import { AppState, appStateCheck } from "shared/types/enums/store/apps";
import { SetAppStateAction } from "../actions/app";

export interface AppReducer {
	state: AppState;
}

const initial_state: AppReducer = {
	state: AppState.GameStart,
};

export type AppReducerActions = SetAppStateAction;

export const appReducer = createReducer<AppReducer, AppReducerActions>(initial_state, {
	set_app_state: (state, action) => {
		assert(appStateCheck(action.newState));
		return {
			...state,
			state: action.newState,
		};
	},
});
