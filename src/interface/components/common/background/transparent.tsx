import Roact from "@rbxts/roact";
import { useInvisibleTransparency } from "shared/utils/interface";

/** Transparent background that fills up the entire parent's size */
export function TransparentBackground(props: Roact.PropsWithChildren) {
  return (
    <frame BorderSizePixel={5} BackgroundTransparency={useInvisibleTransparency()} Size={UDim2.fromScale(1, 1)}>
      {props[Roact.Children]}
    </frame>
  );
}
