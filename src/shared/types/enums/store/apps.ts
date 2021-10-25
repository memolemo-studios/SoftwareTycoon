import { $terrify } from "rbxts-transformer-t";

export const enum AppState {
	GameStart = "GAME_START",
	Main = "Main",
}

export const appStateCheck = $terrify<AppState>();
