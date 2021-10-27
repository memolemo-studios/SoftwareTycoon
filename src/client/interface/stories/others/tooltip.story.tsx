import Roact, { mount, unmount } from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import { StoreProvider } from "@rbxts/roact-rodux";
import { ClientStore } from "client/store/store";
import { HoarcekatStory } from "shared/types/hoarcekat";
import { Thread } from "shared/util/thread";
import Tooltip from "../../components/others/tooltip";

const TestComponent = new RoactHooks(Roact)((_, { useState, useEffect }) => {
	const [hidden, setHidden] = useState(true);

	useEffect(() => {
		const connection = Thread.Loop(1, () => setHidden(!hidden));

		//`componentWillUnmount` or `willUnmount` like function
		return () => connection.Disconnect();
	});

	return <Tooltip Text="lmao" Hidden={hidden} />;
});

export = identity<HoarcekatStory>(parent => {
	// elemento
	const element = (
		<StoreProvider store={ClientStore}>
			<TestComponent />
		</StoreProvider>
	);
	const tree = mount(element, parent);
	return () => unmount(tree);
});
