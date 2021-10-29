import Roact, { PropsWithChildren } from "@rbxts/roact";

interface Props {
	Pading?: UDim;
}

export default function CenterHorizontalConstraint(props: PropsWithChildren<Props>) {
	return (
		<uilistlayout
			HorizontalAlignment={Enum.HorizontalAlignment.Center}
			VerticalAlignment={Enum.VerticalAlignment.Center}
			FillDirection="Horizontal"
			Padding={props.Pading}
		/>
	);
}
