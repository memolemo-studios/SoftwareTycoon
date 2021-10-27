import Roact, { createContext, PropsWithChildren } from "@rbxts/roact";

export namespace Theme {
	export interface PaddingXY {
		PaddingX: number;
		PaddingY: number;
	}

	export interface Frame {
		Background: Color3;
	}

	export interface TextLabel extends Theme.Frame {
		Font: Enum.Font;
		TextColor: Color3;
		TextSize: number;
	}

	export interface TextButton extends Theme.TextLabel, Theme.PaddingXY {
		HoveredColor: Color3;
	}

	export interface Tooltip extends Theme.PaddingXY, Theme.TextLabel {}

	export interface Base {
		Tooltip: Tooltip;
		MainButton: TextButton;
	}
}

const default_theme: Theme.Base = {
	Tooltip: {
		Background: Color3.fromRGB(240, 240, 240),
		TextColor: Color3.fromRGB(89, 89, 89),
		PaddingX: 12,
		PaddingY: 6,
		TextSize: 18,
		Font: Enum.Font.GothamBlack,
	},
	MainButton: {
		Background: Color3.fromRGB(240, 240, 240),
		HoveredColor: Color3.fromRGB(212, 212, 212),
		PaddingX: 12,
		PaddingY: 6,
		TextColor: Color3.fromRGB(28, 28, 28),
		TextSize: 18,
		Font: Enum.Font.SourceSansBold,
	},
};
const ThemeContext = createContext(default_theme);

export function ThemeProvider(props: PropsWithChildren) {
	return <ThemeContext.Provider value={default_theme}>{props[Roact.Children]}</ThemeContext.Provider>;
}

export function withTheme(callback: (theme: Theme.Base) => Roact.Element) {
	return <ThemeContext.Consumer render={callback} />;
}
