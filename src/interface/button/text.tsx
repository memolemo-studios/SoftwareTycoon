import Roact, { PropsWithChildren } from "@rbxts/roact";
import { TextService } from "@rbxts/services";
import XYPadding from "interface/constraints/padding/xy";
import { RoactUtil } from "shared/util/roact";
import { RoactBindable } from "types/roact/value";
import BaseButton, { BaseButtonProps } from "./base";

export interface TextButtonProps extends BaseButtonProps {
	Text?: RoactBindable<string>;
	TextColor?: RoactBindable<Color3>;
	TextSize?: number;
	Font?: Enum.Font;
	PaddingX?: number;
	PaddingY?: number;
}

const DEFAULTS = {
	Font: Enum.Font.SourceSans,
	TextSize: 18,
};

function adjustSizeOnText(text: string, { TextSize, Font }: TextButtonProps) {
	const ideal_size = TextService.GetTextSize(
		text,
		TextSize ?? DEFAULTS.TextSize,
		Font ?? DEFAULTS.Font,
		new Vector2(math.huge, math.huge),
	);
	return UDim2.fromOffset(ideal_size.X, ideal_size.Y);
}

/**
 * BaseButton but with text and adjustable size.
 *
 * **It can be resized automatically if**:
 * - There's no `Size` property, so TextButton will handle that.
 */
export default function TextButton(props: PropsWithChildren<TextButtonProps>) {
	const spread_props = { ...props };
	spread_props.Text = undefined;
	spread_props.TextSize = undefined;
	spread_props.Font = undefined;
	spread_props.PaddingX = undefined;
	spread_props.PaddingY = undefined;
	return (
		<BaseButton {...spread_props}>
			<frame
				Key="TextContainer"
				BackgroundTransparency={1}
				Size={
					RoactUtil.isBinding(props.Text)
						? props.Text.map(v => adjustSizeOnText(v, props))
						: adjustSizeOnText(props.Text ?? "Button", props)
				}
			>
				<XYPadding Key="Padding" offsetX={props.PaddingX} offsetY={props.PaddingY} />
				<textlabel
					Key="Label"
					BackgroundTransparency={1}
					TextColor3={props.TextColor}
					Font={props.Font ?? DEFAULTS.Font}
					TextSize={props.TextSize ?? DEFAULTS.TextSize}
					Text={props.Text}
				/>
			</frame>
		</BaseButton>
	);
}
