import Roact from "@rbxts/roact";

interface Props {
  scaleX?: UDim;
  scaleY?: UDim;
}

/** Padding with equal x and y UDim coordinates */
export function XYPadding(props: Props) {
  return (
    <uipadding
      PaddingLeft={props.scaleX}
      PaddingRight={props.scaleX}
      PaddingTop={props.scaleY}
      PaddingBottom={props.scaleY}
    />
  );
}
