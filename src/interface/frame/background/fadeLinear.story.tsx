import Roact, { mount, unmount } from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import RoactChildrenTest from "interface/storybook/childrenTest";
import { Thread } from "shared/util/thread";
import { HoarcekatStory } from "types/roact/hoarcekat";
import FadeBackgroundFrame from "./fade";

const TestBench: RoactHooks.FC = (_, { useState, useEffect }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const connection = Thread.Loop(1, () => setVisible(!visible));
		return () => connection.Disconnect();
	});

	return (
		<FadeBackgroundFrame
			Color={Color3.fromRGB(233, 122, 9)}
			TweenMethod="Linear"
			LinearProps={{ velocity: 2 }}
			Visible={visible}
		>
			<RoactChildrenTest />
		</FadeBackgroundFrame>
	);
};

export = identity<HoarcekatStory>(parent => {
	const Component = new RoactHooks(Roact)(TestBench);
	const tree = mount(<Component />, parent);
	return () => unmount(tree);
});
