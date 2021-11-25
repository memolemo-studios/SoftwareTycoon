import Roact from "@rbxts/roact";
import { pure, useContext } from "@rbxts/roact-hooked";
import { TextService } from "@rbxts/services";
import Theme from "interface/definitions/theme";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { TransparencyContext } from "../context/transparency";
import { BaseTypographyProps } from "./types";

/** Default game text */
export const Typography = pure<BaseTypographyProps>(props => {
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
        const final_text_size = TextService.GetTextSize(
          text,
          font_size,
          font,
          new Vector2(props.widthOffset ?? math.huge, math.huge),
        );
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
