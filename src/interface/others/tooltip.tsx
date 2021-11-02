import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import { TextService } from "@rbxts/services";
import XYPadding from "interface/constraints/padding/xy";
import { withStyle } from "interface/context/style";
import { BindingUtil } from "shared/util/binding";

interface Props extends Omit<Roact.JsxInstance<Frame>, "BackgroundColor3" | "Transparency"> {
	Hidden?: boolean;
	Text?: string;
}

export default class Tooltip extends Component<Props> {
	public transparencyMotor: SingleMotor;
	public transparencyBinding: Binding<number>;

	public constructor(props: Props) {
		super(props);

		this.transparencyMotor = new SingleMotor(this.getTransparency());
		this.transparencyBinding = BindingUtil.makeBindingFromMotor(this.transparencyMotor);
	}

	private getTransparency() {
		return this.props.Hidden ? 1 : 0;
	}

	public didUpdate(lastProps: Props) {
		if (this.props.Hidden !== lastProps.Hidden) {
			this.transparencyMotor.setGoal(
				new Spring(this.getTransparency(), {
					frequency: 5,
					dampingRatio: 1,
				}),
			);
		}
	}

	public render() {
		return withStyle(style => {
			const spread_props = { ...this.props };
			spread_props.Hidden = undefined;
			spread_props.Text = undefined;
			spread_props[Roact.Children] = undefined;

			const theme = style.Tooltip;
			const final_text = this.props.Text ?? "Tooltip";
			let final_size = this.props.Size;

			if (this.props.Size === undefined) {
				const text_size = TextService.GetTextSize(
					final_text,
					theme.TextSize,
					theme.Font,
					new Vector2(math.huge, math.huge),
				);
				final_size = UDim2.fromOffset(text_size.X + theme.PaddingX * 2, text_size.Y + theme.PaddingX * 2);
			}

			return (
				<frame
					BackgroundColor3={theme.Background}
					BackgroundTransparency={this.transparencyBinding}
					Size={final_size}
					{...spread_props}
				>
					<uicorner CornerRadius={new UDim(0, 8)} />
					<XYPadding offsetX={theme.PaddingX} offsetY={theme.PaddingY} />
					<textlabel
						BackgroundTransparency={1}
						TextColor3={theme.TextColor}
						TextSize={theme.TextSize}
						TextTransparency={this.transparencyBinding}
						Size={UDim2.fromScale(1, 1)}
						Font={theme.Font}
						Text={final_text}
					/>
				</frame>
			);
		});
	}
}
