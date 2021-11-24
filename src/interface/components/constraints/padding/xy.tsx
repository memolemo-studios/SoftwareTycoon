import Roact from "@rbxts/roact";

interface Props {
  scaleX?: UDim;
  scaleY?: UDim;
}

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
