import Roact from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import GameCornerConstraint from "interface/constraints/corner";
import { withStyle } from "interface/context/style";
import TransitionSpringFrame from "interface/frame/spring/transition";
import { RoactBindable } from "types/roact/value";

interface Props {
	AnchorPoint?: RoactBindable<Vector2>;
	Size?: UDim2;
	Position: UDim2;
	Hidden: boolean;
}

const toolbar: RoactHooks.FC<Props> = (props, {}) => {
	function makePositionPhases() {
		const pos = props.Position;
		const hidden = new UDim2(pos.X.Scale, pos.X.Offset, 1, 100);
		return [pos, hidden];
	}
	return withStyle(style => {
		const theme = style.Frame.Main;
		return (
			<TransitionSpringFrame
				AnchorPoint={props.AnchorPoint}
				BackgroundColor3={theme.Background}
				PositionPhases={makePositionPhases()}
				PositionPhaseKeyframe={props.Hidden ? 1 : 0}
				Size={props.Size}
			>
				{props[Roact.Children]}
				<GameCornerConstraint />
			</TransitionSpringFrame>
		);
	});
};

/** Main toolbar for the Main app */
const MainToolbar = new RoactHooks(Roact)(toolbar);

export default MainToolbar;
