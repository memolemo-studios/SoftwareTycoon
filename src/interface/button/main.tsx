import Roact, { PropsWithChildren } from "@rbxts/roact";
import { withStyle } from "interface/context/style";
import TextButton, { TextButtonProps } from "./text";

interface Props
	extends Omit<
		TextButtonProps,
		"BaseColor" | "HoveredColor" | "Text" | "TextColor" | "TextSize" | "Font" | "PaddingX" | "PaddingY"
	> {}

/** BaseButton with MainButton styled with it */
export default function MainButton(props: PropsWithChildren<Props>) {
	return withStyle(style => {
		const theme = style.Buttons.Main;
		const spread_props = { ...props };
		spread_props[Roact.Children] = undefined;
		return (
			<TextButton
				BaseColor={theme.Background}
				HoveredColor={theme.HoverColor}
				Font={theme.Font}
				TextColor={theme.TextColor}
				PaddingX={theme.PaddingX}
				PaddingY={theme.PaddingY}
				TextSize={theme.TextSize}
				{...spread_props}
			>
				{props[Roact.Children]}
			</TextButton>
		);
	});
}
