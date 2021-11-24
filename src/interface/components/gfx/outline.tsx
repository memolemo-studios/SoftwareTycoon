import Roact, { forwardRef } from "@rbxts/roact";
import { GameFlags } from "shared/flags";
import { ValueOrBinding } from "types/roact";

interface Props extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  size?: ValueOrBinding<UDim2>;
  position?: ValueOrBinding<UDim2>;
  radius?: ValueOrBinding<number>;
  transparency?: ValueOrBinding<number>;
  zIndex?: ValueOrBinding<number>;
}

export const Outline = forwardRef<Props, ImageLabel>((props, ref) => {
  return (
    <imagelabel
      AnchorPoint={props.anchorPoint}
      BackgroundTransparency={1}
      Image={GameFlags.CircleOutlineImage}
      ImageColor3={props.color}
      ImageTransparency={props.transparency}
      Position={props.position}
      Ref={ref}
      SliceCenter={new Rect(new Vector2(256, 256), new Vector2(256, 256))}
      SliceScale={props.radius}
      ScaleType={Enum.ScaleType.Slice}
      Size={props.size}
      ZIndex={props.zIndex}
    >
      {props[Roact.Children]}
    </imagelabel>
  );
});
