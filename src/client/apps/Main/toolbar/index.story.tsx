import Roact, { mount, unmount } from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import { HoarcekatStory } from "shared/types/hoarcekat";
import Toolbar from ".";
import MainMenu from ".";

const TestComponent = new RoactHooks(Roact)((_, { useState }) => {
	const [hidden, setHidden] = useState(false);
	return (
		<>
			<textbutton
				Event={{
					MouseButton1Down: () => setHidden(!hidden),
				}}
				Text={`${hidden ? "Open" : "Close"} Toolbar`}
				Size={UDim2.fromOffset(200, 50)}
			/>
			<Toolbar AnchorPoint={new Vector2(0.5, 1)} Position={new UDim2(0.5, 0, 1, -10)} Hidden={hidden} />
		</>
	);
});

export = identity<HoarcekatStory>(parent => {
	// elemento
	const element = <TestComponent />;
	const tree = mount(element, parent);
	return () => unmount(tree);
});