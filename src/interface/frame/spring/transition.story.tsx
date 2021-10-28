import Roact, { mount, unmount } from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import RoactChildrenTest from "interface/storybook/childrenTest";
import { Thread } from "shared/util/thread";
import { HoarcekatStory } from "types/roact/hoarcekat";
import TransitionSpringFrame from "./transition";

const PHASES = [
	UDim2.fromOffset(0, 0),
	UDim2.fromOffset(5, 10),
	UDim2.fromOffset(20, 20),
	UDim2.fromOffset(50, 30),
] as UDim2[];

const TestBench: RoactHooks.FC = (_, { useState, useEffect }) => {
	const [keyframe, setKeyframe] = useState(0);

	useEffect(() => {
		const connection = Thread.Loop(2, () => {
			if (keyframe === 3) {
				setKeyframe(0);
			} else {
				setKeyframe(keyframe + 1);
			}
		});
		return () => connection.Disconnect();
	});

	return (
		<TransitionSpringFrame
			Size={UDim2.fromOffset(200, 20)}
			PositionPhases={PHASES}
			PositionPhaseKeyframe={keyframe}
			SpringProps={{
				frequency: 2,
				damping: 1,
			}}
		>
			<RoactChildrenTest />
		</TransitionSpringFrame>
	);
};

export = identity<HoarcekatStory>(parent => {
	const Component = new RoactHooks(Roact)(TestBench);
	const tree = mount(<Component />, parent);
	return () => unmount(tree);
});
