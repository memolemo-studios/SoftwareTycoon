import { ValueOrBinding } from "types/roact";

export interface BaseRippleProps {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  enabled?: ValueOrBinding<boolean>;
  position?: ValueOrBinding<UDim2>;
  size?: ValueOrBinding<UDim2>;
  zIndex?: ValueOrBinding<number>;
}

export interface BaseRippleMotor {
  scale: number;
  opacity: number;
}
