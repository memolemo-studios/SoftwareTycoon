import Roact, { createContext, PropsWithChildren } from "@rbxts/roact";
import { GameConfigStyles, GameStyle, StyleThemes } from "interface/util/style";

const StyleContext = createContext(GameConfigStyles[StyleThemes.Default]);

export function StyleProvider(props: PropsWithChildren) {
	// TODO: Support for dark mode in settings?
	return (
		<StyleContext.Provider value={GameConfigStyles[StyleThemes.Default]}>
			{props[Roact.Children]}
		</StyleContext.Provider>
	);
}

export function withStyle(callback: (style: GameStyle) => Roact.Element) {
	return <StyleContext.Consumer render={callback} />;
}
