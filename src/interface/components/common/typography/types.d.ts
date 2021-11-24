import Roact from "@rbxts/roact";
import Theme from "interface/definitions/theme";
import { ValueOrBinding } from "types/roact";

export interface BaseTypographyProps {
  alignmentX?: Enum.TextXAlignment;
  alignmentY?: Enum.TextYAlignment;
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  position?: ValueOrBinding<UDim2>;
  layoutOrder?: ValueOrBinding<number>;
  ref?: Roact.Ref<TextLabel>;
  widthOffset?: number;
  strokeColor?: ValueOrBinding<Color3>;
  strokeTransparency?: ValueOrBinding<number>;
  text: ValueOrBinding<string>;
  textSize?: Theme.TextSizes;
  type?: Theme.TextTypes;
}
