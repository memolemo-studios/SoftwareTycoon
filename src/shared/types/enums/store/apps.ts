import { $terrify } from "rbxts-transformer-t";

export const enum AppState {
	Main = "Main",
}

export const appStateCheck = $terrify<AppState>();
