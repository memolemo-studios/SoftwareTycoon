import { $terrify } from "rbxts-transformer-t";

export const enum AppState {
	MainMenu = "MAIN_MENU",
	Main = "MAIN",
}

export const appStateCheck = $terrify<AppState>();
