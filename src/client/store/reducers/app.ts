import { createReducer } from "@rbxts/rodux";
import { $terrify } from "rbxts-transformer-t";
import { AppState } from "types/store/app";
import { SetAppStateAction } from "../actions/app";

export interface AppReducer {
	state: AppState;
}

const app_state_check = $terrify<AppState>();
const initial_state: AppReducer = {
	state: AppState.Main,
};

export type AppReducerActions = SetAppStateAction;

export const appReducer = createReducer<AppReducer, AppReducerActions>(initial_state, {
	set_app_state: (state, action) => {
		assert(app_state_check(action.newState));
		return {
			...state,
			state: action.newState,
		};
	},
});
