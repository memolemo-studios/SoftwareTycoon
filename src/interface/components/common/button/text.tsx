import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { pure, useMutable } from "@rbxts/roact-hooked";
import { TextService } from "@rbxts/services";
import Theme from "interface/definitions/theme";
import { useFlipperMotor } from "interface/hooks/useFlipperMotor";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { GameFlags } from "shared/flags";
import { MathUtil } from "shared/utils/math";
import { RoactUtil } from "shared/utils/roact";
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
    let hover_transparency: Roact.Binding<number>;
    if (RoactUtil.isBinding(transparency)) {
      hover_transparency = Roact.joinBindings({
        context: transparency,
        binding: hover_binding,
      }).map(({ context, binding }) => MathUtil.blendValues(context, binding, Theme.TransparencyButtonHover));
    } else {
      hover_transparency = hover_binding.map(alpha =>
        MathUtil.blendValues(alpha, transparency, Theme.TransparencyButtonHover),
      );
    }
    return (
      <textbutton
        AutoButtonColor={false}
        AnchorPoint={props.anchorPoint}
        BackgroundColor3={props.type === "Outlined" ? Theme.ColorWhite : bkg_color}
        BackgroundTransparency={transparency}
        Event={{
          MouseEnter: () => hover_motor.setGoal(new Spring(0, GameFlags.InterfaceSpringProps)),
          MouseLeave: () => hover_motor.setGoal(new Spring(1, GameFlags.InterfaceSpringProps)),
          MouseButton1Click: () => {
            const does_enabled = RoactUtil.getBindableValue(props.enabled ?? true);
            if (!does_enabled) return;
            props.onClick?.();
          },
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
          enabled={props.enabled}
          position={UDim2.fromScale(0.5, 0.5)}
          size={UDim2.fromScale(1, 1)}
        />
        <textlabel
          Key="HoverOverlay"
          BackgroundColor3={bkg_hover_color}
          BackgroundTransparency={hover_transparency}
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
