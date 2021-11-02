import Roact, { mount, unmount } from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import { StyleProvider } from "interface/context/style";
import { HoarcekatStory } from "types/roact/hoarcekat";
import Toolbar from ".";

const TestComponent = new RoactHooks(Roact)((_, { useState }) => {
	const [hidden, set_hidden] = useState(false);
	return (
		<StyleProvider>
			<textbutton
				Event={{
					MouseButton1Down: () => set_hidden(!hidden),
				}}
				Text={`${hidden ? "Open" : "Close"} Toolbar`}
				Size={UDim2.fromOffset(200, 50)}
			/>
			<Toolbar
				AnchorPoint={new Vector2(0.5, 1)}
				Size={UDim2.fromOffset(340, 70)}
				Position={new UDim2(0.5, 0, 1, -10)}
				Hidden={hidden}
			/>
		</StyleProvider>
	);
});

export = identity<HoarcekatStory>(parent => {
	// elemento
	const element = <TestComponent />;
	const tree = mount(element, parent);
	return () => unmount(tree);
});
