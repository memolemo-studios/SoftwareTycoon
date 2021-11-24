import Roact, { forwardRef } from "@rbxts/roact";
import { GameFlags } from "shared/flags";
import { ValueOrBinding } from "types/roact";
import { TransparencyContext } from "../context/transparency";

interface Props extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  size?: ValueOrBinding<UDim2>;
  position?: ValueOrBinding<UDim2>;
  transparency?: ValueOrBinding<number>;
  zIndex?: ValueOrBinding<number>;
}

export const Circle = forwardRef<Props, ImageLabel>((props, ref) => {
  return (
    <TransparencyContext.Consumer
      render={transparency => {
        return (
          <imagelabel
            AnchorPoint={props.anchorPoint}
            BackgroundTransparency={1}
            Image={GameFlags.CircleImage}
            ImageColor3={props.color}
            ImageTransparency={props.transparency ?? transparency}
            Position={props.position}
            Ref={ref}
            Size={props.size}
            ZIndex={props.zIndex}
          >
            {props[Roact.Children]}
          </imagelabel>
        );
      }}
    />
  );
});
