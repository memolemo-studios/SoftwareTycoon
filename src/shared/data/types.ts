import { Profile } from "@rbxts/profileservice/globals";

export interface PlayerSettings {
	SoundsEnabled: boolean;
}

export interface PlayerData {
	Settings: PlayerSettings;
}

export type PlayerDataProfile = Profile<PlayerData>;
