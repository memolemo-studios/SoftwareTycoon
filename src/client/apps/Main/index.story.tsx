import Roact, { mount, unmount } from "@rbxts/roact";
import ClientStore from "client/store/store";
import { BundleProvider } from "interface/util/bundle";
import { HoarcekatStory } from "types/roact/hoarcekat";
import MainApp from ".";

export = identity<HoarcekatStory>(parent => {
	const tree = mount(
		<BundleProvider store={ClientStore}>
			<MainApp />
		</BundleProvider>,
		parent,
	);
	return () => unmount(tree);
});
