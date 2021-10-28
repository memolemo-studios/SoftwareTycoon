import Roact, { mount, unmount } from "@rbxts/roact";
import RoactChildrenTest from "interface/storybook/childrenTest";
import { HoarcekatStory } from "types/roact/hoarcekat";
import InvisibleBackgroundFrame from "./invisible";

export = identity<HoarcekatStory>(parent => {
	const tree = mount(
		<InvisibleBackgroundFrame>
			<RoactChildrenTest />
		</InvisibleBackgroundFrame>,
		parent,
	);
	return () => unmount(tree);
});
