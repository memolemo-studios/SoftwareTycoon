import Roact, { mount, unmount } from "@rbxts/roact";
import RoactHooks from "@rbxts/roact-hooks";
import { BundleProvider } from "interface/util/bundle";
import { Thread } from "shared/util/thread";
import { HoarcekatStory } from "types/roact/hoarcekat";
import Tooltip from "./tooltip";

const TestBench: RoactHooks.FC = (_, { useEffect, useState }) => {
	const [hidden, setHidden] = useState(true);

	useEffect(() => {
		const connection = Thread.Loop(1, () => setHidden(!hidden));
		return () => connection.Disconnect();
	});

	return <Tooltip Text="lmao" Hidden={hidden} />;
};

export = identity<HoarcekatStory>(parent => {
	const Component = new RoactHooks(Roact)(TestBench);
	const tree = mount(
		<BundleProvider>
			<Component />
		</BundleProvider>,
		parent,
	);
	return () => unmount(tree);
});
