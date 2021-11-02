import Roact from "@rbxts/roact";
import { RoactBindable } from "types/roact/value";
import TransparencyContext from "../../context/transparency";

// The reason it can be exported because it can be extended even further than this component
export interface BackgroundFrameProps {
	FullScreen?: boolean;
	Color?: RoactBindable<Color3>;
	Transparency?: RoactBindable<number>;
}

/** Bring the app into a wide full screen! */
export default function BackgroundFrame(props: Roact.PropsWithChildren<BackgroundFrameProps>) {
	return (
		<frame
			Size={props.FullScreen ? new UDim2(1, 0, 1, 40) : UDim2.fromScale(1, 1)}
			Position={props.FullScreen ? UDim2.fromOffset(0, -40) : undefined}
			BackgroundColor3={props.Color}
			Transparency={props.Transparency}
		>
			<frame
				Key="Container"
				Position={props.FullScreen ? UDim2.fromOffset(0, 40) : new UDim2()}
				Size={new UDim2(1, 0, 1, -40)}
				BackgroundTransparency={1}
			>
				<TransparencyContext.Provider value={props.Transparency ?? 0}>
					{props[Roact.Children]}
				</TransparencyContext.Provider>
			</frame>
		</frame>
	);
}
