import Roact from "@rbxts/roact";
import { ValueOrBinding } from "types/roact";

export interface BaseButtonProps {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  enabled?: boolean;
  layoutOrder?: ValueOrBinding<number>;
  onClick?: () => void;
  position?: ValueOrBinding<UDim2>;
  ref?: Roact.Ref<TextButton>;
}
