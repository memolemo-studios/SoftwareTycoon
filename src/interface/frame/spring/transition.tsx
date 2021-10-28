import Roact, { Component } from "@rbxts/roact";
import BaseSpringFrame, { BaseSpringFrameProps } from "./base";

export interface TransitionSpringProps extends Omit<BaseSpringFrameProps, "Position"> {
	PositionPhases: UDim2[];
	PositionPhaseKeyframe?: number;
}

interface State {
	currentPosition: UDim2;
}

/** BaseSpringFrame but with position phases! */
export default class TransitionSpringFrame extends Component<TransitionSpringProps, State> {
	public constructor(props: TransitionSpringProps) {
		super(props);
		this.updatePhaseProperty();
	}

	private updatePhaseProperty() {
		if (this.props.PositionPhases.isEmpty()) {
			this.props.PositionPhases.push(new UDim2());
		}
		this.setState({
			currentPosition: this.props.PositionPhases[this.props.PositionPhaseKeyframe ?? 0] ?? new UDim2(),
		});
	}

	public didUpdate(lastProps: TransitionSpringProps) {
		if (
			this.props.PositionPhases !== lastProps.PositionPhases ||
			this.props.PositionPhaseKeyframe !== lastProps.PositionPhaseKeyframe
		) {
			this.updatePhaseProperty();
		}
	}

	public render() {
		const spread_props = { ...this.props };
		spread_props.PositionPhases = undefined as unknown as UDim2[];
		spread_props.PositionPhaseKeyframe = undefined;
		spread_props[Roact.Children] = undefined;

		return (
			<BaseSpringFrame Position={this.state.currentPosition} {...spread_props}>
				{this.props[Roact.Children]}
			</BaseSpringFrame>
		);
	}
}
