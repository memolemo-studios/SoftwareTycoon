import { Action, createReducer } from "@rbxts/rodux";
import { GameFlags } from "shared/flags";
import { AppState } from "types/store/appState";

export interface AppReducer {
  state: AppState;
}

export interface SetAppStateAction extends Action<"set_app_state"> {
  newState: AppState;
}

export type AppReducerActions = SetAppStateAction;

const initial_state: AppReducer = {
  state: GameFlags.InitialRoduxAppState,
};

export const app_reducer = createReducer<AppReducer, AppReducerActions>(initial_state, {
  set_app_state: (state, action) => {
    return { ...state, state: action.newState };
  },
});
