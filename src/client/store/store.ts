import { combineReducers, loggerMiddleware, Store } from "@rbxts/rodux";
import { AppReducer, AppReducerActions, app_reducer } from "./reducers/app";

export interface ClientStoreState {
  app: AppReducer;
}

export type ClientStoreActions = AppReducerActions;

export const ClientStore = new Store<ClientStoreState, ClientStoreActions, typeof loggerMiddleware>(
  combineReducers({
    app: app_reducer,
  }),
  undefined,
  [loggerMiddleware],
);
