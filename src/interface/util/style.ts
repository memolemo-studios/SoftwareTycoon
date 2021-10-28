/**
 * CSS like structure, this will get easier
 * if we want dark theme to the game
 */
export namespace Style {
	export interface PaddingXY {
		PaddingX: number;
		PaddingY: number;
	}

	export interface Frame {
		Background: Color3;
	}

	export interface TextLabel extends Style.Frame {
		Font: Enum.Font;
		TextColor: Color3;
		TextSize: number;
	}

	export interface TextButton extends Style.TextLabel, Style.PaddingXY {
		HoverColor: Color3;
	}
}

/** Default game style type structure */
export interface GameStyle {
	Tooltip: Style.PaddingXY & Style.TextLabel;
	Buttons: {
		Main: Style.TextButton;
	};
	Frame: {
		Main: Style.Frame;
	};
}

/** Game style themes */
export enum StyleThemes {
	Default = "DEFAULT",
}

/** Game style configuration */
export const GameConfigStyles: { [key in StyleThemes]: GameStyle } = {
	[StyleThemes.Default]: {
		Tooltip: {
			Background: Color3.fromRGB(240, 240, 240),
			TextColor: Color3.fromRGB(89, 89, 89),
			PaddingX: 12,
			PaddingY: 6,
			TextSize: 18,
			Font: Enum.Font.GothamBlack,
		},
		Buttons: {
			Main: {
				Background: Color3.fromRGB(240, 240, 240),
				HoverColor: Color3.fromRGB(212, 212, 212),
				PaddingX: 12,
				PaddingY: 6,
				TextColor: Color3.fromRGB(28, 28, 28),
				TextSize: 18,
				Font: Enum.Font.SourceSansBold,
			},
		},
		Frame: {
			Main: {
				Background: Color3.fromRGB(227, 227, 227),
			},
		},
	},
};
