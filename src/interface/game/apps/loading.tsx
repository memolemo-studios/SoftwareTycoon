import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { pure, useBinding, useEffect, useMutable } from "@rbxts/roact-hooked";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { GameFlags } from "shared/flags";
import { useInvisibleTransparency } from "shared/utils/interface";
import { Thread } from "shared/utils/thread";

interface Props {
  visible: boolean;
}

export const Loading = pure<Props>(props => {
  const motor = useMutable(new SingleMotor(props.visible ? 0 : 1)).current;
  const binding = useFlipperMotor(motor);
  const [dots, set_dots] = useBinding(1);

  // used for the loop stuff
  useEffect(() => {
    const connection = Thread.loop(1, () => {
      if (dots.getValue() === 3) {
        set_dots(1);
      } else {
        set_dots(dots.getValue() + 1);
      }
    });
    return () => connection.Disconnect();
  }, []);

  // fading effect
  useEffect(() => {
    motor.setGoal(new Spring(props.visible ? 0 : 1, GameFlags.InterfaceSpringProps));
  }, [props.visible]);

  return (
    <frame
      BackgroundColor3={new Color3()}
      BackgroundTransparency={binding}
      Position={UDim2.fromOffset(0, -35)}
      Size={new UDim2(1, 0, 1, 35)}
    >
      <frame
        Key="Container"
        BackgroundTransparency={useInvisibleTransparency()}
        Position={UDim2.fromOffset(0, 35)}
        Size={new UDim2(1, 0, 1, -35)}
      >
        <textlabel
          BackgroundTransparency={1}
          Font={Enum.Font.GothamBlack}
          Text={dots.map(amount => {
            return `Loading Game` + ".".rep(amount);
          })}
          TextColor3={new Color3(1, 1, 1)}
          TextSize={36}
          TextTransparency={binding}
          Size={UDim2.fromScale(1, 1)}
        />
      </frame>
    </frame>
  );
});
