import Roact from "@rbxts/roact";
import { PlayerSettings } from "shared/data/types";
import { withSettings } from "../components/context/settings";
import { Theme, withTheme } from "../components/others/theme";

export default function (callback: (settings: PlayerSettings, theme: Theme.Base) => Roact.Element) {
	return withSettings(settings => withTheme(theme => callback(settings, theme)));
}
