import Roact, { PropsWithChildren } from "@rbxts/roact";
import { OrBinding } from "shared/types/roact";
import TransparencyContext from "../../context/transparency";

export interface BackgroundFrameProps {
	color: OrBinding<Color3>;
	transparency?: OrBinding<number>;
}

export default function BackgroundFrame(props: PropsWithChildren<BackgroundFrameProps>) {
	return (
		<frame
			Size={new UDim2(1, 0, 1, 40)}
			Position={UDim2.fromOffset(0, -40)}
			BackgroundColor3={props.color}
			Transparency={props.transparency}
		>
			<frame
				Key="Container"
				Position={UDim2.fromOffset(0, 40)}
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
			>
				<TransparencyContext.Provider value={props.transparency ?? 0}>
					{props[Roact.Children]}
				</TransparencyContext.Provider>
			</frame>
		</frame>
	);
}
