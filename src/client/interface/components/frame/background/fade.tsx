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
	}

	public didUpdate(lastProps: Props) {
		if (this.props.visible !== lastProps.visible) {
			const constant_value = this.props.visible ?? false ? 1 : 0;
			this.motor.setGoal(
				this.props.tweenMethod === "Linear"
					? new Linear(constant_value, { velocity: this.props.linearProps?.speed })
					: new Spring(constant_value, { ...this.props.springProps! }),
			);
		}
	}

	public render() {
		const initialProps = { ...this.props };
		initialProps.visible = false;
		initialProps[Roact.Children] = undefined;
		return (
			<BackgroundFrame {...initialProps} transparency={this.binding}>
				{this.props[Roact.Children]}
			</BackgroundFrame>
		);
	}
}
