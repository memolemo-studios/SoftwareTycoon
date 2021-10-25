import Roact, { PropsWithChildren } from "@rbxts/roact";

export default function InvisibleFrame(props: PropsWithChildren) {
	return (
		<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			{props[Roact.Children]}
		</frame>
	);
}
