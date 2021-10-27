import Roact, { mount, unmount } from "@rbxts/roact";
import { StoreProvider } from "@rbxts/roact-rodux";
import { ThemeProvider } from "client/interface/components/others/theme";
import { ClientStore } from "client/store/store";
import { HoarcekatStory } from "shared/types/hoarcekat";
import MainMenu from ".";

export = identity<HoarcekatStory>(parent => {
	// elemento
	const element = (
		<ThemeProvider>
			<StoreProvider store={ClientStore}>
				<MainMenu />
			</StoreProvider>
		</ThemeProvider>
	);
	const tree = mount(element, parent);
	return () => unmount(tree);
});
