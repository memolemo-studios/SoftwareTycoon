import Roact, { Component, mount, unmount } from "@rbxts/roact";
import BaseSpringFrame from "client/interface/components/frame/spring/base";
import { HoarcekatStory } from "shared/types/hoarcekat";
import { Thread } from "shared/util/thread";

interface State {
	position: UDim2;
	size: UDim2;
}

class TestStory extends Component<{}, State> {
	private connection: RBXScriptConnection;

	public constructor(props: {}) {
		super(props);

		this.connection = Thread.Loop(2, () => {
			this.generateRandomProps();
		});

		this.generateRandomProps();
	}

	public generateRandomProps() {
		this.setState({
			position: UDim2.fromScale(math.random(), math.random()),
			size: UDim2.fromScale(math.random(), math.random()),
		});
	}

	public render() {
		return (
			<BaseSpringFrame
				Size={this.state.size}
				Position={this.state.position}
				SpringProps={{ Frequency: 2, Damping: 1 }}
			>
				<textlabel Size={UDim2.fromOffset(200, 50)} Text="Roact.Children test" />
			</BaseSpringFrame>
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
