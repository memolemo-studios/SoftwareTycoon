import Roact, { Component, mount, unmount } from "@rbxts/roact";
import TransitionSpringFrame from "client/interface/components/frame/spring/transition";
import { HoarcekatStory } from "shared/types/hoarcekat";
import { Thread } from "shared/util/thread";

interface State {
	positionPhase: number;
}

const PHASES = [
	UDim2.fromOffset(0, 0),
	UDim2.fromOffset(5, 10),
	UDim2.fromOffset(20, 20),
	UDim2.fromOffset(50, 30),
] as UDim2[];

class TestStory extends Component<{}, State> {
	private connection: RBXScriptConnection;

	public constructor(props: {}) {
		super(props);

		this.connection = Thread.Loop(2, () => this.generate());
		this.setState({
			positionPhase: 0,
		});
	}

	public generate() {
		if (this.state.positionPhase === 3) {
			return this.setState({
				positionPhase: 0,
			});
		}
		this.setState({
			positionPhase: (this.state.positionPhase ?? 0) + 1,
		});
	}

	public render() {
		return (
			<TransitionSpringFrame
				Size={UDim2.fromOffset(200, 200)}
				PositionPhases={PHASES}
				PositionPhaseNo={this.state.positionPhase}
				SpringProps={{ Frequency: 2, Damping: 1 }}
			>
				<uilistlayout />
				<textlabel Size={UDim2.fromOffset(200, 50)} Text="Roact.Children test" />
				<textlabel Size={UDim2.fromOffset(200, 50)} Text={`Current phase: ${this.state.positionPhase}`} />
			</TransitionSpringFrame>
		);
	}

	public willUnmount() {
		this.connection.Disconnect();
	}
}

export = identity<HoarcekatStory>(parent => {
	const element = <TestStory />;
	const tree = mount(element, parent);
	return () => unmount(tree);
});
