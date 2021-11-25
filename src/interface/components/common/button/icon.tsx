import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { hooked, useMutable } from "@rbxts/roact-hooked";
import Theme from "interface/definitions/theme";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { GameFlags } from "shared/flags";
import { MathUtil } from "shared/utils/math";
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
        transparency={overlay_binding.map(alpha => MathUtil.lerp(1, Theme.TransparencyIconButtonOverlay, alpha))}
        position={UDim2.fromScale(0.5, 0.5)}
        size={final_extended_size}
      />
      <StaticRipple
        Key="Ripple"
        anchorPoint={new Vector2(0.5, 0.5)}
        color={props.color}
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
