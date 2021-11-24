import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { pure, useEffect, useMutable } from "@rbxts/roact-hooked";
import Theme from "interface/definitions/theme";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { GameFlags } from "shared/flags";
import { ValueOrBinding } from "types/roact";
import { Card } from "./card";
import { GameCornerConstraint } from "./constraints/corner";
import { TransparencyContext } from "./context/transparency";

interface Props {
  anchorPoint?: ValueOrBinding<Vector2>;
  size?: ValueOrBinding<UDim2>;
  position?: ValueOrBinding<UDim2>;
  visible?: boolean;
}

export const Tooltip = pure<Roact.PropsWithChildren<Props>>(props => {
  const motor = useMutable(new SingleMotor(props.visible ? 0 : 1)).current;
  const binding = useFlipperMotor(motor);

  // fading effect
  useEffect(() => {
    motor.setGoal(new Spring(props.visible ? 0 : 1, GameFlags.InterfaceSpringProps));
  }, [props.visible]);

  return (
    <Card
      anchorPoint={props.anchorPoint}
      color={Theme.ColorWhite}
      transparency={binding}
      position={props.position}
      size={props.size}
    >
      {props[Roact.Children]}
    </Card>
  );
});
