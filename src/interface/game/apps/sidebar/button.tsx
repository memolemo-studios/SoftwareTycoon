import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { pure, useEffect, useMutable, useState } from "@rbxts/roact-hooked";
import { Shadow } from "interface/components/gfx/shadow";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { GameFlags } from "shared/flags";

interface Props {
  onClick: () => void;
}

const BUTTON_SIZE = 60;
const SHADOW_SIZE = 3;

export const SidebarButton = pure<Props>(props => {
  const motor = useMutable(new SingleMotor(0)).current;
  const [hovered, set_hovered] = useState(false);
  const binding = useFlipperMotor(motor);

  // update the motor, every time when the button is hovered
  useEffect(() => {
    motor.setGoal(new Spring(hovered ? 1 : 0, GameFlags.InterfaceSpringProps));
  }, [hovered]);

  return (
    <Shadow
      size={new UDim2(0, BUTTON_SIZE + SHADOW_SIZE, 0, BUTTON_SIZE + SHADOW_SIZE)}
      transparency={0.4}
      radius={0.04}
    >
      <textbutton
        AutoButtonColor={false}
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={binding.map(alpha => {
          return new Color3(1, 1, 1).Lerp(Color3.fromRGB(232, 232, 232), alpha);
        })}
        Event={{
          MouseButton1Click: props.onClick,
          MouseEnter: () => set_hovered(true),
          MouseLeave: () => set_hovered(false),
        }}
        Position={UDim2.fromScale(0.5, 0.5)}
        Size={new UDim2(1, -SHADOW_SIZE * 2, 1, -SHADOW_SIZE * 2)}
        Text=""
      >
        <uicorner CornerRadius={new UDim(0, 8)} />
      </textbutton>
    </Shadow>
  );
});
