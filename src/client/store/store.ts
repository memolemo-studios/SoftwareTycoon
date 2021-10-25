import { Store, combineReducers, loggerMiddleware } from "@rbxts/rodux";
import { appReducer, AppReducer, AppReducerActions } from "./reducers/app";

export interface ClientStoreState {
	app: AppReducer;
}

export type ClientStoreActions = AppReducerActions;

export const ClientStore = new Store<ClientStoreState, ClientStoreActions, typeof loggerMiddleware>(
	combineReducers({
		app: appReducer,
	}),
	{},
	[loggerMiddleware],
);
