import { createContext, PropsWithChildren } from "@rbxts/roact";
import Roact from "@rbxts/roact";
import { DEFAULT_PLAYER_SETTINGS } from "shared/constants/playersettings";
import { PlayerSettings } from "types/player/settings";

const SettingsContext = createContext(DEFAULT_PLAYER_SETTINGS);

export function SettingsProvider(props: PropsWithChildren) {
	// TODO: Support for player settings
	return <SettingsContext.Provider value={DEFAULT_PLAYER_SETTINGS}>{props[Roact.Children]}</SettingsContext.Provider>;
}

export function withSettings(callback: (settings: PlayerSettings) => Roact.Element) {
	return <SettingsContext.Consumer render={callback} />;
}
