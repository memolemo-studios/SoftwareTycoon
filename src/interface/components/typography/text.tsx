import Roact from "@rbxts/roact";
import { pure, useContext } from "@rbxts/roact-hooked";
import { TextService } from "@rbxts/services";
import Theme from "interface/definitions/theme";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { ValueOrBinding } from "types/roact";
import { TransparencyContext } from "../context/transparency";

interface Props {
  alignmentX?: Enum.TextXAlignment;
  alignmentY?: Enum.TextYAlignment;
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  position?: ValueOrBinding<UDim2>;
  layoutOrder?: ValueOrBinding<number>;
  ref?: Roact.Ref<TextLabel>;
  widthOffset?: number;
  strokeColor?: ValueOrBinding<Color3>;
  strokeTransparency?: ValueOrBinding<number>;
  text: ValueOrBinding<string>;
  textSize?: Theme.TextSizes;
  type?: Theme.TextTypes;
}

function getTextSize(text: string, font: Enum.Font, font_size: number, offsetX?: number) {
  return TextService.GetTextSize(text, font_size, font, new Vector2(offsetX ?? math.huge, math.huge));
}

export const Text = pure<Props>(props => {
  const font_type = props.type ?? "Normal";
  const font = Theme.FontTypes[font_type];
  const font_size = props.textSize ?? Theme.FontTypeSizes[font_type];
  const transparency = useContext(TransparencyContext);
  return (
    <textlabel
      AnchorPoint={props.anchorPoint}
      BackgroundTransparency={1}
      Font={font}
      LayoutOrder={props.layoutOrder}
      Position={props.position}
      Ref={props.ref}
      Size={mapBindableProp(props.text, text => {
        const final_text_size = getTextSize(text, font, font_size, props.widthOffset);
        return UDim2.fromOffset(final_text_size.X, final_text_size.Y);
      })}
      Text={props.text}
      TextColor3={props.color ?? Theme.ColorBlack}
      TextTransparency={transparency}
      TextSize={font_size}
      TextStrokeColor3={props.strokeColor}
      TextStrokeTransparency={props.strokeTransparency}
      TextXAlignment={props.alignmentX}
      TextYAlignment={props.alignmentY}
      TextWrapped={true}
    />
  );
});
