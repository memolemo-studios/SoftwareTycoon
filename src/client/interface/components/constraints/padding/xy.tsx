import Roact, { PropsWithChildren } from "@rbxts/roact";

interface Props {
	offsetX?: number;
	scaleX?: number;
	offsetY?: number;
	scaleY?: number;
}

export default function XYPadding({ scaleX, offsetX, scaleY, offsetY }: PropsWithChildren<Props>) {
	return (
		<uipadding
			PaddingBottom={new UDim(scaleY, offsetY)}
			PaddingTop={new UDim(scaleY, offsetY)}
			PaddingLeft={new UDim(scaleX, offsetX)}
			PaddingRight={new UDim(scaleX, offsetX)}
		/>
	);
}
