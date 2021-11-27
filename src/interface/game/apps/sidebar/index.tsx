import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { pure, useEffect, useMutable } from "@rbxts/roact-hooked";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { GameFlags } from "shared/flags";
import { useInvisibleTransparency } from "shared/utils/interface";
import { SidebarButton } from "./button";

interface Props {
  visible: boolean;
}

export const Sidebar = pure<Props>(props => {
  const motor = useMutable(new SingleMotor(props.visible ? 1 : 0)).current;
  const binding = useFlipperMotor(motor);

  // update the motor, whenever 'visible' property is changed?
  useEffect(() => {
    motor.setGoal(new Spring(props.visible ? 1 : 0, GameFlags.InterfaceSpringProps));
  }, [props.visible]);

  return (
    <frame
      AnchorPoint={new Vector2(0.5, 1)}
      BackgroundColor3={Color3.fromRGB(255, 255, 255)}
      BackgroundTransparency={useInvisibleTransparency()}
      BorderSizePixel={2}
      Position={binding.map(alpha => {
        return new UDim2(0.5, 0, 1, 100).Lerp(new UDim2(0.5, 0, 1, -10), alpha);
      })}
      Size={UDim2.fromOffset(400, 70)}
    >
      {/** Constraints */}
      <uilistlayout
        Padding={new UDim(0, 6)}
        HorizontalAlignment={Enum.HorizontalAlignment.Center}
        VerticalAlignment={Enum.VerticalAlignment.Center}
        FillDirection={Enum.FillDirection.Horizontal}
      />

      {/** Buttons */}
      <SidebarButton onClick={() => {}} />
      <SidebarButton onClick={() => {}} />
      <SidebarButton onClick={() => {}} />
      <SidebarButton onClick={() => {}} />
      <SidebarButton onClick={() => {}} />
    </frame>
  );
});
