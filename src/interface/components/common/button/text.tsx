import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { pure, useMutable } from "@rbxts/roact-hooked";
import { TextService } from "@rbxts/services";
import Theme from "interface/definitions/theme";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { GameFlags } from "shared/flags";
import { MathUtil } from "shared/utils/math";
import { ValueOrBinding } from "types/roact";
import { GameCornerConstraint } from "../constraint/corner/default";
import { RoundedOutline } from "../effect/outline/rounded";
import { withTransparency } from "../functions/withTransparency";
import { TouchRipple } from "../ripples/touch";
import { BaseButtonProps } from "./types";

interface Props extends BaseButtonProps {
  size?: ValueOrBinding<UDim2>;
  text?: ValueOrBinding<string>;
  type: Theme.TypesButton;
}

export const TextButton = pure<Props>(props => {
  const hover_motor = useMutable(new SingleMotor(1)).current;
  const hover_binding = useFlipperMotor(hover_motor);

  const bkg_color = Theme.ColorsButtonType[props.type];
  const text_color = Theme.TextColorsButtonType[props.type];
  const bkg_hover_color = Theme.ColorsButtonTypeHover[props.type];

  return withTransparency(transparency => {
    return (
      <textbutton
        AutoButtonColor={false}
        AnchorPoint={props.anchorPoint}
        BackgroundColor3={props.type === "Outlined" ? Theme.ColorWhite : bkg_color}
        BackgroundTransparency={transparency}
        Event={{
          MouseEnter: () => hover_motor.setGoal(new Spring(0, GameFlags.InterfaceSpringProps)),
          MouseLeave: () => hover_motor.setGoal(new Spring(1, GameFlags.InterfaceSpringProps)),
          MouseButton1Click: props.onClick,
        }}
        LayoutOrder={props.layoutOrder}
        Position={props.position}
        Ref={props.ref}
        Size={
          props.size === undefined
            ? mapBindableProp(props.text ?? "", text => {
                const final_text_size = TextService.GetTextSize(
                  text,
                  Theme.FontSizeButton,
                  Theme.FontButton,
                  new Vector2(math.huge, math.huge),
                );
                return UDim2.fromOffset(final_text_size.X + 30, final_text_size.Y + 17);
              })
            : props.size
        }
        Text=""
      >
        {props.type === "Outlined" && (
          <RoundedOutline
            Key="Outline"
            color={bkg_color}
            radius={0.02}
            size={UDim2.fromScale(1, 1)}
            transparency={transparency}
            zIndex={2}
          />
        )}
        <TouchRipple
          Key="Ripple"
          anchorPoint={new Vector2(0.5, 0.5)}
          color={bkg_hover_color}
          position={UDim2.fromScale(0.5, 0.5)}
          size={UDim2.fromScale(1, 1)}
        />
        <textlabel
          Key="HoverOverlay"
          BackgroundColor3={bkg_hover_color}
          BackgroundTransparency={hover_binding.map(alpha => {
            return MathUtil.lerp(Theme.TransparencyButtonHover, 1, alpha);
          })}
          Size={UDim2.fromScale(1, 1)}
          Text=""
        >
          <GameCornerConstraint Key="Constraint" />
        </textlabel>
        <textlabel
          Key="Text"
          BackgroundTransparency={1}
          Font={Theme.FontButton}
          Size={UDim2.fromScale(1, 1)}
          Text={props.text}
          TextColor3={text_color}
          TextTransparency={transparency}
          TextSize={Theme.FontSizeButton}
        />
        <GameCornerConstraint Key="Constraint" />
        {props[Roact.Children]}
      </textbutton>
    );
  });
});