import { Bin } from "@rbxts/bin";
import { Instant, SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, BindingFunction, Component } from "@rbxts/roact";
import Theme from "interface/definitions/theme";
import { GameFlags } from "shared/flags";
import { RoactUtil } from "shared/utils/roact";
import { ValueOrBinding } from "types/roact";
import { IconButton } from "interface/components/button/icon";
import { TextButton } from "interface/components/button/text";
import { Card } from "interface/components/card";
import { HorizontalListConstraint } from "interface/components/constraints/list/horizontal";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";
import { TransparencyContext } from "interface/components/context/transparency";
import { Icon } from "interface/components/icon";
import { FullLine } from "interface/components/others/line";
import { AdjustableText } from "interface/components/typography/adjustableText";
import { Text } from "interface/components/typography/text";

interface ButtonInfo {
  text: string;
  onClick?: () => void;
}

interface State {
  rendered: boolean;
}

interface Props {
  anchorPoint?: ValueOrBinding<Vector2>;
  buttons?: ButtonInfo[];
  iconColor?: ValueOrBinding<Color3>;
  iconType: Theme.IconTypes;
  onClose?: () => void;
  position?: ValueOrBinding<UDim2>;
  message?: ValueOrBinding<string>;
  title?: ValueOrBinding<string>;
  visible?: ValueOrBinding<boolean>;
}

const WITH_BUTTON_Y_SIZE = 36;

export class PopupAlert extends Component<Props, State> {
  private bin = new Bin();

  private sizeMotor: SingleMotor;
  private sizeBinding: Binding<number>;

  private textHeight: Binding<number>;
  private setTextHeight: BindingFunction<number>;

  private infoMotor: SingleMotor;
  private infoBinding: Binding<number>;

  private adjustedHeight: Binding<number>;

  public constructor(props: Props) {
    super(props);

    // size motors
    this.sizeMotor = new SingleMotor(0);
    this.sizeBinding = RoactUtil.makeBindingFromMotor(this.sizeMotor);

    // info motors
    this.infoMotor = new SingleMotor(props.visible ? 0 : 1);
    this.infoBinding = RoactUtil.makeBindingFromMotor(this.infoMotor);

    // heights
    [this.textHeight, this.setTextHeight] = Roact.createBinding(0);
    this.adjustedHeight = this.sizeBinding.map(alpha => {
      // prettier-ignore
      return (
        (alpha * 50)
          + (this.textHeight.getValue() * alpha)
          + (this.hasButtons() ? 15 * alpha : 0)
      );
    });

    this.setState({ rendered: this.infoMotor.getValue() === 0 });

    const connection = this.sizeMotor.onStep(alpha => {
      if (alpha === 1) {
        // make the info visible
        this.infoMotor.setGoal(new Spring(0, GameFlags.InterfaceSpringProps));
      }
      if (alpha === 0) {
        this.setState({ rendered: false });
      }
    });

    this.bin.add(() => connection.disconnect());
    this.updateSizeSpring(false);
  }

  public hasButtons() {
    return this.props.buttons !== undefined && !this.props.buttons.isEmpty();
  }

  public makeButtons() {
    const buttons = new Array<Roact.Element>();
    if (this.props.buttons !== undefined) {
      for (const button of this.props.buttons) {
        buttons.push(<TextButton type="Secondary" text={button.text} onClick={button.onClick} />);
      }
    }
    return buttons;
  }

  public updateSizeSpring(animate: boolean) {
    if (animate) {
      this.sizeMotor.setGoal(new Spring(this.props.visible ? 1 : 0, GameFlags.InterfaceSpringProps));
    } else {
      this.sizeMotor.setGoal(new Instant(this.props.visible ? 1 : 0));
    }
  }

  public didUpdate(last_props: Props) {
    task.spawn(() => {
      if (last_props.visible !== this.props.visible) {
        if (this.props.visible === false) {
          this.infoMotor.setGoal(new Spring(1, GameFlags.InterfaceSpringProps));
          task.wait(0.3);
        } else {
          this.setState({ rendered: true });
        }
        this.updateSizeSpring(true);
      }
    });
  }

  public render() {
    if (!this.state.rendered) return undefined;
    return (
      <FullLine
        Key="AlertLine"
        anchorPoint={this.props.anchorPoint}
        position={this.props.position}
        height={this.adjustedHeight.map(height => {
          const spring_multipler = this.sizeMotor.getValue();
          return (
            // prettier-ignore
            height
              + (6 * spring_multipler) + (this.hasButtons()
                ? (WITH_BUTTON_Y_SIZE / 2) * spring_multipler
                : 0
            )
          );
        })}
      >
        <Card
          Key="Card"
          padding={new UDim(0, 12)}
          size={this.adjustedHeight.map(height => {
            return UDim2.fromOffset(Theme.AlertWidth, height);
          })}
          useShadow={false}
        >
          {/* Constraints */}
          <VerticalListConstraint padding={new UDim(0, 4)} />
          <TransparencyContext.Provider value={this.infoBinding}>
            <FullLine Key="TitleLine" layoutOrder={0} height={24}>
              {/* Icon */}
              <Icon Key="Icon" color={this.props.iconColor} type={this.props.iconType} />

              {/* Title */}
              <Text
                Key="Title"
                position={UDim2.fromOffset(40, 0)}
                text={this.props.title ?? "Alert"}
                type="Subheading"
              />

              {/* Close Button */}
              {this.props.onClose && (
                <IconButton
                  anchorPoint={new Vector2(1, 0)}
                  color={new Color3(0, 0, 0)}
                  onClick={this.props.onClose}
                  size={15}
                  type="Close"
                  position={UDim2.fromScale(1, 0)}
                />
              )}
            </FullLine>

            {/* Message */}
            {this.props.message !== undefined && (
              <FullLine layoutOrder={1} Key="Message" height={this.textHeight}>
                <AdjustableText
                  Key="Message"
                  layoutOrder={1}
                  position={UDim2.fromOffset(40, 0)}
                  alignmentX={Enum.TextXAlignment.Left}
                  onChanged={(_, height) => {
                    this.setTextHeight(height);
                  }}
                  text={this.props.message}
                  type="Normal"
                  widthOffset={Theme.AlertWidth - 70}
                />
              </FullLine>
            )}

            {/* Buttons */}
            {this.hasButtons() && (
              <FullLine Key="Buttons" layoutOrder={2} height={36}>
                <HorizontalListConstraint horizontalAlignment={Enum.HorizontalAlignment.Right} />
                {this.makeButtons()}
              </FullLine>
            )}
          </TransparencyContext.Provider>
        </Card>
      </FullLine>
    );
  }

  public willUnmount() {
    this.bin.destroy();
  }
}
