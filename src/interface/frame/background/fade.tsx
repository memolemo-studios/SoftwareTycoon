import { Linear, SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import { BindingUtil } from "shared/util/binding";
import BackgroundFrame, { BackgroundFrameProps } from "./base";

type LinearMotorMethod = {
	TweenMethod: "Linear";
	LinearProps?: {
		velocity: number;
	};
};

type SpringMotorMethod = {
	TweenMethod: "Spring";
	SpringProps?: {
		frequency: number;
		damping: number;
	};
};

type Props = Omit<BackgroundFrameProps, "Transparency"> & {
	Visible: boolean;
} & (LinearMotorMethod | SpringMotorMethod);

/** BackgroundFrame but it is fading whenever the transparency property changes */
export default class FadeBackgroundFrame extends Component<Props> {
	public binding: Binding<number>;
	public motor: SingleMotor;

	public constructor(props: Props) {
		super(props);

		this.motor = new SingleMotor(0);
		this.binding = BindingUtil.makeBindingFromMotor(this.motor);
	}

	public getTransparencyFromProp() {
		return (this.props.Visible === undefined ? false : this.props.Visible) === true ? 0 : 1;
	}

	/** Updates transparency based on the props available */
	public updateTransparency() {
		const constant_value = this.getTransparencyFromProp();
		this.motor.setGoal(
			this.props.TweenMethod === "Linear"
				? new Linear(constant_value, { ...this.props.LinearProps })
				: new Spring(constant_value, { ...this.props.SpringProps }),
		);
	}

	public didUpdate(lastProps: Props) {
		if (this.props.Visible !== lastProps.Visible) {
			this.updateTransparency();
		}
	}

	public render() {
		// excluding props and injecting it to BackgroundFrame
		// to avoid unexpected collisions
		const spread_props = { ...this.props };
		spread_props[Roact.Children] = undefined;
		spread_props.Visible = undefined as unknown as boolean;
		return (
			<BackgroundFrame {...spread_props} Transparency={this.binding}>
				{this.props[Roact.Children]}
			</BackgroundFrame>
		);
	}
}
