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
import { GameCornerConstraint } from "../constraints/corner";
import { TransparencyContext } from "../context/transparency";
import { Outline } from "../gfx/outline";
import { TouchRipple } from "../gfx/ripples/touch";

interface Props {
  anchorPoint?: ValueOrBinding<Vector2>;
  layoutOrder?: number;
  onClick?: () => void;
  position?: ValueOrBinding<UDim2>;
  ref?: Roact.Ref<TextButton>;
  size?: ValueOrBinding<UDim2>;
  text?: string;
  type: Theme.ButtonColorTypes;
}

function getTextSize(text: string, font: Enum.Font, font_size: number) {
  return TextService.GetTextSize(text, font_size, font, new Vector2(math.huge, math.huge));
}

export const TextButton = pure<Props>(props => {
  const hover_motor = useMutable(new SingleMotor(1)).current;
  const hover_binding = useFlipperMotor(hover_motor);

  const bkg_color = Theme.BtnTypeColors[props.type];
  const text_color = Theme.BtnTypeTextColors[props.type];
  const bkg_hover_color = Theme.BtnTypeHoverColors[props.type];

  return (
    <TransparencyContext.Consumer
      render={transparency => {
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
                    const final_text_size = getTextSize(text, Theme.ButtonFont, Theme.ButtonFontSize);
                    return UDim2.fromOffset(final_text_size.X + 30, final_text_size.Y + 17);
                  })
                : props.size
            }
            Text=""
          >
            {props.type === "Outlined" && (
              <Outline
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
                return MathUtil.lerp(Theme.ButtonHoverVisibleAlpha, 1, alpha);
              })}
              Size={UDim2.fromScale(1, 1)}
              Text=""
            >
              <GameCornerConstraint />
            </textlabel>
            <textlabel
              Key="Text"
              BackgroundTransparency={1}
              Font={Theme.ButtonFont}
              Size={UDim2.fromScale(1, 1)}
              Text={props.text}
              TextColor3={text_color}
              TextTransparency={transparency}
              TextSize={Theme.ButtonFontSize}
            />
            <GameCornerConstraint />
            {props[Roact.Children]}
          </textbutton>
        );
      }}
    />
  );
});
