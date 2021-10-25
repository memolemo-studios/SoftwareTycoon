import { $terrify } from "rbxts-transformer-t";

export const enum AppState {
	GameStart = "GAME_START",
	Main = "MAIN",
}

export const appStateCheck = $terrify<AppState>();
