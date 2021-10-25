import Roact, { mount, unmount } from "@rbxts/roact";
import { StoreProvider } from "@rbxts/roact-rodux";
import { ClientStore } from "client/store/store";
import { AppState } from "shared/types/enums/store/apps";
import { HoarcekatStory } from "shared/types/hoarcekat";
import { Thread } from "shared/util/thread";
import GameStart from "./gameStart";

export = identity<HoarcekatStory>(parent => {
	// preparations
	let visible = false;

	// elemento
	const element = (
		<StoreProvider store={ClientStore}>
			<GameStart />
		</StoreProvider>
	);

	const connection = Thread.Loop(2, () => {
		visible = !visible;
		ClientStore.dispatch({
			type: "set_app_state",
			newState: visible ? AppState.GameStart : AppState.Main,
		});
	});

	const tree = mount(element, parent);
	return () => {
		connection.Disconnect();
		unmount(tree);
	};
});
