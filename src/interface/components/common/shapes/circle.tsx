import Roact, { forwardRef } from "@rbxts/roact";
import { GameFlags } from "shared/flags";
import { withTransparency } from "../functions/withTransparency";
import { BaseShapeProps } from "./types";

/** Shape of the circle go burrr */
export const Circle = forwardRef<BaseShapeProps, ImageLabel>((props, ref) => {
  return withTransparency(transparency => {
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
  });
});
