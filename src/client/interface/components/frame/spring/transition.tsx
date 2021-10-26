import Roact, { Component } from "@rbxts/roact";
import BaseSpringFrame, { BaseSpringFrameProps } from "./base";

interface Props extends Omit<BaseSpringFrameProps, "Position"> {
	PositionPhases: UDim2[];
	PositionPhaseNo?: number;
}

interface State {
	currentPosition: UDim2;
}

export default class TransitionSpringFrame extends Component<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.updatePhaseProperty();
	}

	public updatePhaseProperty() {
		if (this.props.PositionPhases.isEmpty()) {
			this.props.PositionPhases.push(new UDim2());
		}

		this.setState({
			currentPosition: this.props.PositionPhases[this.props.PositionPhaseNo ?? 0] ?? new UDim2(),
		});
	}

	public didUpdate(lastProps: Props) {
		if (
			this.props.PositionPhases !== lastProps.PositionPhases ||
			this.props.PositionPhaseNo !== lastProps.PositionPhaseNo
		) {
			this.updatePhaseProperty();
		}
	}

	public render() {
		const finalProps = { ...this.props };
		finalProps.PositionPhases = undefined as unknown as UDim2[];
		finalProps.PositionPhaseNo = undefined;
		finalProps[Roact.Children] = undefined;
		return (
			<BaseSpringFrame Position={this.state.currentPosition} {...finalProps}>
				{this.props[Roact.Children]}
			</BaseSpringFrame>
		);
	}
}
