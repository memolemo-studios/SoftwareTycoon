import Roact, { mount, unmount } from "@rbxts/roact";
import { StoreProvider } from "@rbxts/roact-rodux";
import { ClientStore } from "client/store/store";
import { HoarcekatStory } from "shared/types/hoarcekat";
import MainPage from ".";

export = identity<HoarcekatStory>(parent => {
	// elemento
	const element = (
		<StoreProvider store={ClientStore}>
			<MainPage />
		</StoreProvider>
	);
	const tree = mount(element, parent);
	return () => unmount(tree);
});
