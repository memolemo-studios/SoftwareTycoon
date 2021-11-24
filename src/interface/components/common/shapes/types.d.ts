import Roact from "@rbxts/roact";
import { ValueOrBinding } from "types/roact";

export interface BaseShapeProps extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  size?: ValueOrBinding<UDim2>;
  position?: ValueOrBinding<UDim2>;
  transparency?: ValueOrBinding<number>;
  zIndex?: ValueOrBinding<number>;
}
