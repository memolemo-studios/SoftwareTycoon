import { combineReducers, loggerMiddleware, Store } from "@rbxts/rodux";
import { appReducer, AppReducer, AppReducerActions } from "./reducers/app";

export interface ClientStoreState {
	app: AppReducer;
}

export type ClientStoreActions = AppReducerActions;

const ClientStore = new Store<ClientStoreState, ClientStoreActions, typeof loggerMiddleware>(
	combineReducers({
		app: appReducer,
	}),
	undefined,
	[loggerMiddleware],
);

export default ClientStore;
