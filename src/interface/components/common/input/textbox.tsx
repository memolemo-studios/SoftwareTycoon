import Roact from "@rbxts/roact";
import { pure } from "@rbxts/roact-hooked";
import Theme from "interface/definitions/theme";
import { RoactUtil } from "shared/utils/roact";
import { ValueOrBinding } from "types/roact";
import { GameCornerConstraint } from "../constraint/corner/default";
import { withTransparency } from "../functions/withTransparency";

interface Props extends Roact.PropsWithChildren {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  enabled?: ValueOrBinding<boolean>;
  layoutOrder?: ValueOrBinding<number>;
  font?: ValueOrBinding<Enum.Font>;
  initialText?: string;
  onChange?: (new_text: string) => void;
  placeholderColor?: ValueOrBinding<Color3>;
  placeholder?: ValueOrBinding<string>;
  position?: ValueOrBinding<UDim2>;
  size?: ValueOrBinding<UDim2>;
  transparency?: ValueOrBinding<number>;
  textColor?: ValueOrBinding<Color3>;
  textSize?: ValueOrBinding<number>;
  xAlignment?: ValueOrBinding<Enum.TextXAlignment>;
  yAlignment?: ValueOrBinding<Enum.TextYAlignment>;
}

export const InputTextbox = pure<Props>(props => {
  return withTransparency(transparency => {
    return (
      <textbox
        AnchorPoint={props.anchorPoint}
        BackgroundColor3={
          props.color ?? props.enabled ?? true ? Theme.ColorBackgroundTextbox : Theme.ColorBackgroundTextboxDisabled
        }
        BackgroundTransparency={transparency}
        BorderSizePixel={0}
        Change={{
          Text: box => props.onChange?.(box.Text),
        }}
        Event={{
          Focused: obj => {
            const is_enabled = RoactUtil.getBindableValue(props.enabled ?? true);
            if (!is_enabled) {
              obj.ReleaseFocus();
            }
          },
        }}
        ClipsDescendants={true}
        Font={props.font ?? Theme.FontTypes.Normal}
        LayoutOrder={props.layoutOrder}
        PlaceholderColor3={props.placeholderColor ?? Theme.ColorForegroundPlaceholderText}
        PlaceholderText={props.placeholder ?? "Enter any text here"}
        Position={props.position}
        Size={props.size}
        Text={props.initialText ?? ""}
        TextColor3={props.textColor ?? Theme.ColorForegroundTextbox}
        TextSize={props.textSize ?? Theme.FontTypeSizes.Normal}
        TextTransparency={transparency}
        TextXAlignment={props.xAlignment}
        TextYAlignment={props.yAlignment}
      >
        <GameCornerConstraint />
        {props[Roact.Children]}
      </textbox>
    );
  });
});
