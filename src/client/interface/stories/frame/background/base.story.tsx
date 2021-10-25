import Roact, { mount, unmount } from "@rbxts/roact";
import BackgroundFrame from "client/interface/components/frame/background/base";
import { HoarcekatStory } from "shared/types/hoarcekat";

export = identity<HoarcekatStory>(parent => {
	const element = (
		<BackgroundFrame color={Color3.fromRGB(23, 128, 233)}>
			<textlabel Size={UDim2.fromOffset(200, 50)} Text="Roact.Children test" />
		</BackgroundFrame>
	);
	const tree = mount(element, parent);
	return () => unmount(tree);
});
