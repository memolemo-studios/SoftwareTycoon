import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { hooked, useMutable } from "@rbxts/roact-hooked";
import Theme from "interface/definitions/theme";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { GameFlags } from "shared/flags";
import { MathUtil } from "shared/utils/math";
import { ValueOrBinding } from "types/roact";
import { Circle } from "../gfx/circle";
import { StaticRipple } from "../gfx/ripples/static";
import { Icon } from "../icon";

interface Props {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  onClick?: () => void;
  position?: ValueOrBinding<UDim2>;
  ref?: Roact.Ref<TextButton>;
  size?: number;
  type: Theme.IconTypes;
}

export const IconButton = hooked<Props>(props => {
  const overlay_motor = useMutable(new SingleMotor(0)).current;
  const overlay_binding = useFlipperMotor(overlay_motor);
  const final_extended_size = new UDim2(1, Theme.IconButtonExtendedRadius, 1, Theme.IconButtonExtendedRadius);
  return (
    <Icon
      anchorPoint={props.anchorPoint}
      color={props.color}
      position={props.position}
      size={UDim2.fromOffset(props.size ?? Theme.IconDefaultSize, props.size ?? Theme.IconDefaultSize)}
      type={props.type}
    >
      <Circle
        anchorPoint={new Vector2(0.5, 0.5)}
        color={props.color ?? new Color3(1, 1, 1)}
        transparency={overlay_binding.map(alpha => MathUtil.lerp(1, 0.8, alpha))}
        position={UDim2.fromScale(0.5, 0.5)}
        size={final_extended_size}
      />
      <StaticRipple
        anchorPoint={new Vector2(0.5, 0.5)}
        color={props.color}
        position={UDim2.fromScale(0.5, 0.5)}
        size={final_extended_size}
        rippleRadius={(props.size ?? Theme.IconDefaultSize) + Theme.IconButtonExtendedRadius}
        ripplePosition={UDim2.fromScale(0.5, 0.5)}
        zIndex={2}
      />
      <textbutton
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
