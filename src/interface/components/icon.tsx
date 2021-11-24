import Roact, { forwardRef } from "@rbxts/roact";
import Theme from "interface/definitions/theme";
import { ValueOrBinding } from "types/roact";
import { TransparencyContext } from "./context/transparency";

interface Props extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  position?: ValueOrBinding<UDim2>;
  size?: ValueOrBinding<UDim2>;
  type: Theme.IconTypes;
}

export const Icon = forwardRef<Props, ImageLabel>((props, ref) => {
  const icon_url = Theme.IconUrls[props.type];
  const default_size = props.size ?? UDim2.fromOffset(Theme.IconDefaultSize, Theme.IconDefaultSize);
  return (
    <TransparencyContext.Consumer
      render={transparency => (
        <imagelabel
          AnchorPoint={props.anchorPoint}
          BackgroundTransparency={1}
          BorderSizePixel={0}
          Ref={ref}
          Position={props.position}
          Size={default_size}
          Image={icon_url}
          ImageColor3={props.color ?? new Color3(1, 1, 1)}
          ImageTransparency={transparency}
        >
          {props[Roact.Children]}
        </imagelabel>
      )}
    />
  );
});
