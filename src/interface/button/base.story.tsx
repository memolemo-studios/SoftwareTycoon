import Roact, { mount, unmount } from "@rbxts/roact";
import { cleanupAssets } from "interface/util/asset";
import { BundleProvider } from "interface/util/bundle";
import { HoarcekatStory } from "types/roact/hoarcekat";
import BaseButton from "./base";

export = identity<HoarcekatStory>(parent => {
	const tree = mount(
		<BundleProvider>
			<BaseButton Size={UDim2.fromOffset(200, 50)} SoundsEnabled={false} />
		</BundleProvider>,
		parent,
	);
	return () => {
		unmount(tree);
		cleanupAssets();
	};
});
