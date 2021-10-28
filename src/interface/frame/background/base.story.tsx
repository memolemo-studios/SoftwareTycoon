import Roact, { mount, unmount } from "@rbxts/roact";
import RoactChildrenTest from "interface/storybook/childrenTest";
import { HoarcekatStory } from "types/roact/hoarcekat";
import BackgroundFrame from "./base";

export = identity<HoarcekatStory>(parent => {
	const tree = mount(
		<BackgroundFrame Color={Color3.fromRGB(23, 128, 233)}>
			<RoactChildrenTest />
		</BackgroundFrame>,
		parent,
	);
	return () => unmount(tree);
});
