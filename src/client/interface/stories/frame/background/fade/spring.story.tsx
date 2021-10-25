import Roact, { Component, mount, unmount } from "@rbxts/roact";
import FadeBackgroundFrame from "client/interface/components/frame/background/fade";
import { HoarcekatStory } from "shared/types/hoarcekat";
import { Thread } from "shared/util/thread";

interface State {
	visible: boolean;
}

class FadeStory extends Component<{}, State> {
	private connection: RBXScriptConnection;

	public constructor(props: {}) {
		super(props);
		this.setState({
			visible: false,
		});
		this.connection = Thread.Loop(1, () =>
			this.setState({
				visible: !this.state.visible,
			}),
		);
	}

	public render() {
		return (
			<FadeBackgroundFrame
				color={Color3.fromRGB(233, 122, 9)}
				tweenMethod="Spring"
				springProps={{ frequency: 2, damping: 1 }}
				visible={this.state.visible}
			>
				<textlabel Size={UDim2.fromOffset(200, 50)} Text="Roact.Children test" />
			</FadeBackgroundFrame>
		);
	}

	public willUnmount() {
		this.connection.Disconnect();
	}
}

export = identity<HoarcekatStory>(parent => {
	const element = <FadeStory />;
	const tree = mount(element, parent);
	return () => unmount(tree);
});
