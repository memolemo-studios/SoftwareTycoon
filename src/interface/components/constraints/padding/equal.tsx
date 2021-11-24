import Roact from "@rbxts/roact";
import { XYPadding } from "./xy";

interface Props {
  scale?: UDim;
}

export function EqualPadding({ scale }: Props) {
  return <XYPadding scaleX={scale} scaleY={scale} />;
}
