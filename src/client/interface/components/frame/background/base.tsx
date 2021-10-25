import Roact, { PropsWithChildren } from "@rbxts/roact";
import { OrBinding } from "shared/types/roact";

export interface BackgroundFrameProps {
	color: OrBinding<Color3>;
	transparency?: OrBinding<number>;
}

export default function BackgroundFrame(props: PropsWithChildren<BackgroundFrameProps>) {
	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={props.color} Transparency={props.transparency}>
			{props[Roact.Children]}
		</frame>
	);
}
