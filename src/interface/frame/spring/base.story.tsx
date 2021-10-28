import Roact, { mount, unmount } from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import RoactChildrenTest from "interface/storybook/childrenTest";
import { Thread } from "shared/util/thread";
import { HoarcekatStory } from "types/roact/hoarcekat";
import BaseSpringFrame from "./base";

function generateProps() {
	return {
		size: UDim2.fromScale(math.random(), math.random()),
		position: UDim2.fromScale(math.random(), math.random()),
	};
}

const TestBench: RoactHooks.FC = (_, { useState, useEffect }) => {
	const [props, setProps] = useState(generateProps());

	useEffect(() => {
		const connection = Thread.Loop(2, () => setProps(generateProps()));
		return () => connection.Disconnect();
	});

	return (
		<BaseSpringFrame
			Size={props.size}
			Position={props.position}
			SpringProps={{
				frequency: 2,
				damping: 1,
			}}
		>
			<RoactChildrenTest />
		</BaseSpringFrame>
	);
};

export = identity<HoarcekatStory>(parent => {
	const Component = new RoactHooks(Roact)(TestBench);
	const tree = mount(<Component />, parent);
	return () => unmount(tree);
});
