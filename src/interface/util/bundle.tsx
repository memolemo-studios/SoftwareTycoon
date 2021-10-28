import Roact, { PropsWithChildren } from "@rbxts/roact";
import { StoreProvider } from "@rbxts/roact-rodux";
import type ClientStore from "client/store/store";
import { SettingsProvider, withSettings } from "interface/context/settings";
import { StyleProvider, withStyle } from "interface/context/style";
import { withTransparency } from "interface/context/transparency";
import { GameStyle } from "interface/util/style";
import { PlayerSettings } from "types/player/settings";
import { RoactBindable } from "types/roact/value";

/**
 * Straight forward inserting required components such as:
 * - StoreProvider (if store property does exists)
 * - StyleProvider
 * - SettingsProvider
 */
export function BundleProvider(props: PropsWithChildren<{ store?: typeof ClientStore }>) {
	const bundle_wrapper = (
		<SettingsProvider>
			<StyleProvider>{props[Roact.Children]}</StyleProvider>
		</SettingsProvider>
	);
	return props.store !== undefined ? (
		<StoreProvider store={props.store}>{bundle_wrapper}</StoreProvider>
	) : (
		bundle_wrapper
	);
}

/**
 * Straight forward providing required components such as:
 * - StyleProvider
 * - SettingsProvider
 * - TransparencyProvider
 */
export function withBundle(
	callback: (style: GameStyle, settings: PlayerSettings, transparency: RoactBindable<number>) => Roact.Element,
) {
	return withStyle(style => {
		return withSettings(settings => {
			return withTransparency(transparency => {
				return callback(style, settings, transparency);
			});
		});
	});
}
