import Roact, { mount, unmount } from "@rbxts/roact";
import { cleanupAssets } from "interface/util/asset";
import { BundleProvider } from "interface/util/bundle";
import { HoarcekatStory } from "types/roact/hoarcekat";
import TextButton from "./text";

export = identity<HoarcekatStory>(parent => {
	const tree = mount(
		<BundleProvider>
			<TextButton
				BaseColor={new Color3(1, 1, 1)}
				HoveredColor={new Color3(0.9, 0.9, 0.9)}
				Text="Yo!"
				TextSize={18}
				Font={Enum.Font.SourceSans}
				TextColor={new Color3(0, 0, 0)}
				Size={UDim2.fromOffset(200, 50)}
				SoundsEnabled={false}
			/>
		</BundleProvider>,
		parent,
	);
	return () => {
		unmount(tree);
		cleanupAssets();
	};
});
