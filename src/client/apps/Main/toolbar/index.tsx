import Roact, { Component } from "@rbxts/roact";
import TransitionSpringFrame from "client/interface/components/frame/spring/transition";
import { OrBinding } from "shared/types/roact";

interface Props {
	AnchorPoint?: OrBinding<Vector2>;
	Position: UDim2;
	Hidden: boolean;
}

export default class Toolbar extends Component<Props> {
	public makePositionPhases() {
		const pos = this.props.Position;
		const hidden_position = new UDim2(pos.X.Scale, pos.X.Offset, 1, 100);
		return [pos, hidden_position];
	}

	public render() {
		return (
			<TransitionSpringFrame
				AnchorPoint={this.props.AnchorPoint}
				Size={UDim2.fromOffset(500, 70)}
				PositionPhases={this.makePositionPhases()}
				PositionPhaseNo={this.props.Hidden ? 1 : 0}
			>
				{this.props[Roact.Children]}
				<uicorner CornerRadius={new UDim(0, 8)} />
			</TransitionSpringFrame>
		);
	}
}
