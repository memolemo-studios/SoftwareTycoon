import Roact from "@rbxts/roact";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { useInvisibleTransparency } from "shared/utils/interface";
import { ValueOrBinding } from "types/roact";

interface Props {
  anchorPoint?: ValueOrBinding<Vector2>;
  layoutOrder?: ValueOrBinding<number>;
  position?: ValueOrBinding<UDim2>;
  height?: ValueOrBinding<number>;
}

export const FullLine = (props: Roact.PropsWithChildren<Props>) => {
  return (
    <frame
      AnchorPoint={props.anchorPoint}
      BackgroundTransparency={useInvisibleTransparency()}
      BorderSizePixel={0}
      LayoutOrder={props.layoutOrder}
      Position={props.position}
      Size={mapBindableProp(props.height ?? 0, height => {
        return new UDim2(1, 0, 0, height);
      })}
    >
      {props[Roact.Children]}
    </frame>
  );
};
