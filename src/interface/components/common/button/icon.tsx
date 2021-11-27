import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { hooked, useMutable } from "@rbxts/roact-hooked";
import Theme from "interface/definitions/theme";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { GameFlags } from "shared/flags";
import { MathUtil } from "shared/utils/math";
import { RoactUtil } from "shared/utils/roact";
import { withTransparency } from "../functions/withTransparency";
import { Icon } from "../icon/default";
import { StaticRipple } from "../ripples/static";
import { Circle } from "../shapes/circle";
import { BaseButtonProps } from "./types";

interface Props extends BaseButtonProps {
  size?: number;
  type: Theme.TypesIcon;
}

export const IconButton = hooked<Props>(props => {
  const overlay_motor = useMutable(new SingleMotor(0)).current;
  const overlay_binding = useFlipperMotor(overlay_motor);
  const final_extended_size = new UDim2(
    1,
    Theme.RadiusIconButtonExtendedOverlay,
    1,
    Theme.RadiusIconButtonExtendedOverlay,
  );
  return withTransparency(transparency => {
    let hover_transparency: Roact.Binding<number>;
    if (RoactUtil.isBinding(transparency)) {
      hover_transparency = Roact.joinBindings({
        context: transparency,
        binding: overlay_binding,
      }).map(({ context, binding }) => MathUtil.blendValues(context, binding, Theme.TransparencyButtonHover));
    } else {
      hover_transparency = overlay_binding.map(alpha =>
        MathUtil.blendValues(alpha, transparency, Theme.TransparencyButtonHover),
      );
    }
    return (
      <Icon
        anchorPoint={props.anchorPoint}
        color={props.color}
        position={props.position}
        size={UDim2.fromOffset(props.size ?? Theme.DefaultSizeIcon, props.size ?? Theme.DefaultSizeIcon)}
        type={props.type}
      >
        <Circle
          Key="ButtonOverlay"
          anchorPoint={new Vector2(0.5, 0.5)}
          color={props.color ?? new Color3(1, 1, 1)}
          transparency={hover_transparency}
          position={UDim2.fromScale(0.5, 0.5)}
          size={final_extended_size}
        />
        <StaticRipple
          Key="Ripple"
          anchorPoint={new Vector2(0.5, 0.5)}
          color={props.color}
          enabled={props.enabled}
          position={UDim2.fromScale(0.5, 0.5)}
          size={final_extended_size}
          rippleRadius={(props.size ?? Theme.DefaultSizeIcon) + Theme.RadiusIconButtonExtendedOverlay}
          ripplePosition={UDim2.fromScale(0.5, 0.5)}
          zIndex={2}
        />
        <textbutton
          Key="Button"
          BackgroundTransparency={1}
          Event={{
            Activated: () => props.onClick?.(),
            MouseEnter: () => overlay_motor.setGoal(new Spring(1, GameFlags.InterfaceSpringProps)),
            MouseLeave: () => overlay_motor.setGoal(new Spring(0, GameFlags.InterfaceSpringProps)),
          }}
          Ref={props.ref}
          Size={final_extended_size}
          Text=""
        />
      </Icon>
    );
  });
});
