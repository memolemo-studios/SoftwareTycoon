import Roact, { mount, unmount } from "@rbxts/roact";
import BaseButton from "client/interface/components/button/base";
import { ThemeProvider } from "client/interface/components/others/theme";
import { HoarcekatStory } from "shared/types/hoarcekat";

export = identity<HoarcekatStory>(parent => {
	// elemento
	const element = (
		<ThemeProvider>
			<BaseButton Size={UDim2.fromOffset(200, 50)} DisableSounds={true} />
		</ThemeProvider>
	);
	const tree = mount(element, parent);
	return () => unmount(tree);
});
