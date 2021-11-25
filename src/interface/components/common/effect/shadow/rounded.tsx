import Roact, { forwardRef } from "@rbxts/roact";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { GameFlags } from "shared/flags";
import { ValueOrBinding } from "types/roact";

interface Props extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  distance?: number;
  size?: ValueOrBinding<UDim2>;
  position?: ValueOrBinding<UDim2>;
  radius?: ValueOrBinding<number>;
  transparency?: ValueOrBinding<number>;
  visible?: ValueOrBinding<boolean>;
  zIndex?: ValueOrBinding<number>;
}

/** Shadow effect component */
export const RoundedShadow = forwardRef<Props, ImageLabel>((props, ref) => {
  return (
    <imagelabel
      AnchorPoint={props.anchorPoint}
      BackgroundTransparency={1}
      Image={GameFlags.ShadowImage}
      ImageColor3={props.color ?? new Color3(0, 0, 0)}
      ImageTransparency={props.transparency}
      Position={mapBindableProp(props.position ?? new UDim2(), position => {
        return position.add(UDim2.fromOffset(0, props.distance ?? 0));
      })}
      Ref={ref}
      SliceCenter={new Rect(new Vector2(256, 256), new Vector2(256, 256))}
      SliceScale={props.radius}
      ScaleType={Enum.ScaleType.Slice}
      Size={props.size}
      Visible={props.visible}
      ZIndex={props.zIndex}
    >
      {props[Roact.Children]}
    </imagelabel>
  );
});
