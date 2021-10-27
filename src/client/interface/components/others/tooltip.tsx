import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import { TextService } from "@rbxts/services";
import { makeBindingFromMotor } from "shared/util/binding";
import XYPadding from "../constraints/padding/xy";
import { withTheme } from "./theme";

interface Props extends Omit<Roact.JsxInstance<Frame>, "BackgroundColor3" | "Transparency"> {
	Hidden?: boolean;
	Text?: string;
}

export default class Tooltip extends Component<Props> {
	private transparencyMotor: SingleMotor;
	private transparencyBinding: Binding<number>;

	public constructor(props: Props) {
		super(props);

		this.transparencyMotor = new SingleMotor(this.getTransparency());
		this.transparencyBinding = makeBindingFromMotor(this.transparencyMotor);
	}

	public getTransparency() {
		return this.props.Hidden ? 0 : 1;
	}

	public didUpdate(lastProps: Props) {
		if (this.props.Hidden !== lastProps.Hidden) {
			this.transparencyMotor.setGoal(
				new Spring(this.getTransparency(), {
					frequency: 6,
					dampingRatio: 1,
				}),
			);
		}
	}

	public render() {
		return withTheme(themeProp => {
			const injected_props = { ...this.props };
			injected_props.Text = undefined;
			injected_props.Hidden = undefined;

			const theme = themeProp.Tooltip;
			const default_text = this.props.Text ?? "Tooltip";
			const text_size = TextService.GetTextSize(
				default_text,
				theme.TextSize,
				theme.Font,
				new Vector2(math.huge, math.huge),
			);

			return (
				<frame
					BackgroundColor3={theme.Background}
					BackgroundTransparency={this.transparencyBinding}
					Size={UDim2.fromOffset(text_size.X + theme.PaddingX * 2, text_size.Y + theme.PaddingX * 2)}
					{...injected_props}
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
						Text={default_text}
					/>
				</frame>
			);
		});
	}
}
