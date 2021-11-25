import Roact from "@rbxts/roact";
import { ValueOrBinding } from "types/roact";

interface Props {
  color?: ValueOrBinding<Color3>;
}

/** Full background that fills up the entire parent's size */
export function FullBackground(props: Roact.PropsWithChildren<Props>) {
  return (
    <frame BackgroundColor3={props.color} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)}>
      {props[Roact.Children]}
    </frame>
  );
}
