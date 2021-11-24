import Roact, { Component, createBinding } from "@rbxts/roact";
import { TextService } from "@rbxts/services";
import Theme from "interface/definitions/theme";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { ValueOrBinding } from "types/roact";
import { withTransparency } from "../functions/withTransparency";
import { BaseTypographyProps } from "./types";

interface Props extends BaseTypographyProps {
  heightOffset?: ValueOrBinding<number>;
  onChanged?: (textWidth: number, textHeight: number) => void;
}

export class AdjustableTypography extends Component<Props> {
  private sizeBinding: Roact.Binding<UDim2>;
  private updateSizeBinding: Roact.BindingFunction<UDim2>;

  public constructor(props: Props) {
    super(props);

    // no 'widthOffset' with non-nullable 'heighOffset', throw an error!
    // because it will render a single line only
    if (this.props.widthOffset === undefined && this.props.heightOffset !== undefined) {
      error("Failed to create 'AdjustableText' because 'widthOffset' is nil but 'heightOffset' is defined");
    }

    // create a binding for the size
    [this.sizeBinding, this.updateSizeBinding] = createBinding(new UDim2());
  }

  private getDefaultProps() {
    const font_type = this.props.type ?? "Normal";
    const font = Theme.FontTypes[font_type];
    const font_size = this.props.textSize ?? Theme.FontTypeSizes[font_type];
    return { font_type, font, font_size };
  }

  private needsToBeUpdated(last_size: UDim2) {
    const has_width_prop = this.props.widthOffset !== undefined;
    const has_height_prop = this.props.heightOffset !== undefined;
    const current_size = this.sizeBinding.getValue();
    // prettier-ignore
    return (
      (has_height_prop && current_size.X.Offset === last_size.X.Offset)
      && (has_width_prop && current_size.Y.Offset === last_size.Y.Offset)
    )
      || (current_size === last_size);
  }

  private updateText() {
    // too many map bindable props
    mapBindableProp(this.props.text, text => {
      const { font, font_size } = this.getDefaultProps();

      // adjusting sizes
      let width_offset = math.huge;
      let height_offset = math.huge;

      if (this.props.widthOffset !== undefined) {
        mapBindableProp(this.props.widthOffset, width => (width_offset = width));
      }
      if (this.props.heightOffset !== undefined) {
        mapBindableProp(this.props.heightOffset, height => (height_offset = height));
      }

      const adjusted_size = TextService.GetTextSize(text, font_size, font, new Vector2(width_offset, height_offset));
      this.updateSizeBinding(UDim2.fromOffset(adjusted_size.X, adjusted_size.Y));
      this.props.onChanged?.(adjusted_size.X, adjusted_size.Y);
    });
  }

  public didMount() {
    this.updateText();
  }

  public didUpdate() {
    this.updateText();
  }

  public render() {
    const { font, font_size } = this.getDefaultProps();
    return withTransparency(transparency => {
      return (
        <textlabel
          AnchorPoint={this.props.anchorPoint}
          BackgroundTransparency={1}
          Change={{
            AbsolutePosition: () => this.updateText(),
            AbsoluteSize: lb => {
              const abs_size = lb.AbsolutePosition;
              const udim_size = UDim2.fromOffset(abs_size.X, abs_size.Y);
              if (this.needsToBeUpdated(udim_size)) {
                this.updateText();
              }
            },
          }}
          Font={font}
          LayoutOrder={this.props.layoutOrder}
          Position={this.props.position}
          Ref={this.props.ref}
          Size={this.sizeBinding}
          Text={this.props.text}
          TextColor3={this.props.color ?? Theme.ColorBlack}
          TextSize={font_size}
          TextStrokeColor3={this.props.strokeColor}
          TextStrokeTransparency={this.props.strokeTransparency}
          TextTransparency={transparency}
          TextXAlignment={this.props.alignmentX}
          TextYAlignment={this.props.alignmentY}
          TextWrapped={true}
        />
      );
    });
  }
}
