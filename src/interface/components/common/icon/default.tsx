import Roact from "@rbxts/roact";
import Theme from "interface/definitions/theme";
import { ValueOrBinding } from "types/roact";
import { withTransparency } from "../functions/withTransparency";

interface Props extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  layoutOrder?: ValueOrBinding<number>;
  position?: ValueOrBinding<UDim2>;
  size?: ValueOrBinding<UDim2>;
  type: Theme.TypesIcon;
}

/** Standard game icon component */
export const Icon = Roact.forwardRef<Props, ImageLabel>((props, ref) => {
  const icon_url = Theme.ImageIcons[props.type];
  const default_size = props.size ?? UDim2.fromOffset(Theme.DefaultSizeIcon, Theme.DefaultSizeIcon);
  return withTransparency(transparency => {
    return (
      <imagelabel
        AnchorPoint={props.anchorPoint}
        BackgroundTransparency={1}
        BorderSizePixel={0}
        LayoutOrder={props.layoutOrder}
        Ref={ref}
        Position={props.position}
        Size={default_size}
        Image={icon_url}
        ImageColor3={props.color ?? new Color3(1, 1, 1)}
        ImageTransparency={transparency}
      >
        {props[Roact.Children]}
      </imagelabel>
    );
  });
});
