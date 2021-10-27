import { SingleMotor, Linear, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import { makeBindingFromMotor } from "shared/util/binding";
import BackgroundFrame, { BackgroundFrameProps } from "./base";

type Props = Omit<BackgroundFrameProps, "transparency"> & {
	visible?: boolean;
} & (
		| {
				tweenMethod: "Linear";
				linearProps?: {
					speed: number;
				};
		  }
		| {
				tweenMethod: "Spring";
				springProps?: {
					frequency: number;
					damping: number;
				};
		  }
	);

export default class FadeBackgroundFrame extends Component<Props> {
	public binding: Binding<number>;
	public motor: SingleMotor;

	public constructor(props: Props) {
		super(props);

		this.motor = new SingleMotor(0);
		this.binding = makeBindingFromMotor(this.motor);

		this.updateBackground();
	}

	public canBeVisible() {
		return (this.props.visible === undefined ? false : this.props.visible) === true ? 0 : 1;
	}

	public updateBackground() {
		const constant_value = this.canBeVisible();
		this.motor.setGoal(
			this.props.tweenMethod === "Linear"
				? new Linear(constant_value, { velocity: this.props.linearProps?.speed })
				: new Spring(constant_value, { ...this.props.springProps! }),
		);
	}

	public didUpdate(lastProps: Props) {
		if (this.props.visible !== lastProps.visible) {
			this.updateBackground();
		}
	}

	public render() {
		const injected_props = { ...this.props };
		injected_props.visible = false;
		injected_props[Roact.Children] = undefined;
		return (
			<BackgroundFrame {...injected_props} transparency={this.binding}>
				{this.props[Roact.Children]}
			</BackgroundFrame>
		);
	}
}
