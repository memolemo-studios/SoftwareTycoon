// This script is based on my other scrapped Gitlab repo

import { Instant, SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import { makeBindingFromMotor } from "shared/util/binding";

export interface BaseSpringFrameProps extends Omit<Roact.JsxInstance<Frame>, "Position" | "Size"> {
	Position?: UDim2;
	Size?: UDim2;
	SpringProps?: {
		Frequency?: number;
		Damping?: number;
	};
}

export default class BaseSpringFrame extends Component<BaseSpringFrameProps> {
	private lastPosition?: UDim2;
	private lastSize?: UDim2;

	private positionMotor: SingleMotor;
	private positionBinding: Binding<number>;

	private sizeMotor: SingleMotor;
	private sizeBinding: Binding<number>;

	public constructor(props: BaseSpringFrameProps) {
		super(props);

		this.positionMotor = new SingleMotor(0);
		this.positionBinding = makeBindingFromMotor(this.positionMotor);

		this.sizeMotor = new SingleMotor(0);
		this.sizeBinding = makeBindingFromMotor(this.sizeMotor);

		this.lastPosition = this.props.Position;
		this.lastSize = this.props.Size;
	}

	private isPositionChanged(lastProps: BaseSpringFrameProps) {
		return (
			lastProps.Position !== this.props.Position &&
			this.props.Position !== undefined &&
			lastProps.Position !== undefined
		);
	}

	private isSizeChanged(lastProps: BaseSpringFrameProps) {
		return lastProps.Size !== this.props.Size && this.props.Size !== undefined && lastProps.Size !== undefined;
	}

	public withSpringProps() {
		return {
			frequency: this.props.SpringProps?.Frequency,
			dampingRatio: this.props.SpringProps?.Damping,
		};
	}

	public makeSpringFromProps(value: number) {
		return new Spring(value, this.withSpringProps());
	}

	public didUpdate(lastProps: BaseSpringFrameProps) {
		// make sure it did changed the position
		if (this.isPositionChanged(lastProps)) {
			this.lastPosition = lastProps.Position;
			this.positionMotor.setGoal(new Instant(0));

			// a simple fix?
			this.positionMotor.step(1);

			// assume the position is valid
			this.positionMotor.setGoal(this.makeSpringFromProps(1));
		}

		// make sure it did changed the size
		if (this.isSizeChanged(lastProps)) {
			this.lastSize = lastProps.Size;
			this.sizeMotor.setGoal(new Instant(0));

			// a simple fix?
			this.sizeMotor.step(1);

			// assume the position is valid
			this.sizeMotor.setGoal(this.makeSpringFromProps(1));
		}
	}

	public render() {
		const injected_props = { ...this.props };
		injected_props[Roact.Children] = undefined;
		injected_props.Position = undefined;
		injected_props.Size = undefined;
		injected_props.SpringProps = undefined;
		return (
			<frame
				{...injected_props}
				Position={this.positionBinding.map(alpha => {
					const new_position = this.props.Position ?? new UDim2();
					const last_position = this.lastPosition ?? new UDim2();
					return last_position.Lerp(new_position, alpha);
				})}
				Size={this.sizeBinding.map(alpha => {
					const new_size = this.props.Size ?? new UDim2();
					const last_size = this.lastSize ?? new UDim2();
					return last_size.Lerp(new_size, alpha);
				})}
			>
				{this.props[Roact.Children]}
			</frame>
		);
	}
}
