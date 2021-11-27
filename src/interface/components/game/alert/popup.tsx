import { Bin } from "@rbxts/bin";
import { Instant, Spring } from "@rbxts/flipper";
import Roact, { Binding, PureComponent } from "@rbxts/roact";
import { IconButton } from "interface/components/common/button/icon";
import { TextButton } from "interface/components/common/button/text";
import { Card } from "interface/components/common/card/default";
import { HorizontalListConstraint } from "interface/components/common/constraint/list/horizontal";
import { VerticalListConstraint } from "interface/components/common/constraint/list/vertical";
import { TransparencyContext } from "interface/components/common/context/transparency";
import { Icon } from "interface/components/common/icon/default";
import { FullLine } from "interface/components/common/others/fullLine";
import { AdjustableTypography } from "interface/components/common/typography/adjustable";
import { Typography } from "interface/components/common/typography/default";
import Theme from "interface/definitions/theme";
import { BindingBundle, BindingBundleMotor } from "shared/classes/roact/binding";
import { GameFlags } from "shared/flags";
import { ValueOrBinding } from "types/roact";

interface ButtonInfo {
  text: ValueOrBinding<string>;
  enabled?: boolean;
  onClick?: () => void;
}

interface State {
  rendered: boolean;
}

interface Props {
  anchorPoint?: ValueOrBinding<Vector2>;
  buttons?: ButtonInfo[];
  iconColor?: ValueOrBinding<Color3>;
  iconType?: Theme.TypesIcon;
  onClose?: () => void;
  position?: ValueOrBinding<UDim2>;
  message?: ValueOrBinding<string>;
  title?: ValueOrBinding<string>;
  visible?: boolean;
}

const WITH_BUTTON_Y_SIZE = 36;

export class PopupAlert extends PureComponent<Props, State> {
  private bin = new Bin();

  private sizeBundle: BindingBundleMotor;
  private infoBundle: BindingBundleMotor;
  private adjustedHeight: Binding<number>;
  private enableBundle: BindingBundle<boolean>;
  private textHeight: BindingBundle<number>;

  public constructor(props: Props) {
    super(props);

    // motor setup
    const is_visible = props.visible ?? false;
    this.sizeBundle = new BindingBundleMotor();
    this.infoBundle = new BindingBundleMotor(is_visible ? 0 : 1);
    this.textHeight = new BindingBundle(0);
    this.enableBundle = new BindingBundle<boolean>(is_visible);

    // preparation stuff
    const size_motor = this.sizeBundle.getMotor();
    const connection = size_motor.onStep(alpha => {
      if (alpha === 1) {
        // make the info visible
        this.infoBundle.getMotor().setGoal(new Spring(0, GameFlags.InterfaceSpringProps));
      } else if (alpha === 0) {
        this.setState({ rendered: false });
      }
    });

    this.adjustedHeight = Roact.joinBindings({
      alpha: this.sizeBundle.get(),
      text_height: this.textHeight.get(),
    }).map(({ alpha, text_height }) => {
      return alpha * 50 + text_height * alpha + (this.hasButtons() ? 15 * alpha : 0);
    });

    this.setState({ rendered: is_visible });
    this.updateSizeSpring(false);
    this.bin.add(() => connection.disconnect());
  }

  private updateSizeSpring(animate: boolean) {
    const size_motor = this.sizeBundle.getMotor();
    if (animate) {
      size_motor.setGoal(new Spring(this.props.visible ? 1 : 0, GameFlags.InterfaceSpringProps));
    } else {
      size_motor.setGoal(new Instant(this.props.visible ? 1 : 0));
      size_motor.step(1);
    }
  }

  private hasButtons() {
    return this.props.buttons !== undefined && !this.props.buttons.isEmpty();
  }

  public didUpdate(last_props: Props) {
    // it will be laggy if it is not spawned in a new thread
    task.spawn(() => {
      if (last_props.visible === this.props.visible) return;
      if (this.props.visible === false) {
        this.infoBundle.getMotor().setGoal(new Spring(1, GameFlags.InterfaceSpringProps));
        this.enableBundle.set(false);
        task.wait(0.3);
      } else {
        this.enableBundle.set(true);
        this.setState({ rendered: true });
      }
      this.updateSizeSpring(true);
    });
  }

  private makeButtons() {
    const buttons = new Array<Roact.Element>();
    if (this.props.buttons !== undefined) {
      for (const button of this.props.buttons) {
        buttons.push(
          <TextButton
            type="Secondary"
            enabled={this.enableBundle.get().map(is_enabled => {
              // if it is enabled, we need to tell if that button is enabled
              // from the properties
              if (is_enabled) {
                return button.enabled ?? true;
              }
              return false;
            })}
            text={button.text}
            onClick={button.onClick}
          />,
        );
      }
    }
    return buttons;
  }

  public render() {
    // to avoid problems, we need to hide the popup
    if (!this.state.rendered) {
      return undefined;
    }
    const has_icon = this.props.iconType !== undefined;
    return (
      <frame
        AnchorPoint={this.props.anchorPoint}
        BackgroundTransparency={1}
        Position={this.props.position}
        Size={this.adjustedHeight.map(height => {
          const alpha = this.sizeBundle.getValue();
          const change = height + (this.hasButtons() ? (WITH_BUTTON_Y_SIZE / 2) * alpha : 0);
          return UDim2.fromOffset(Theme.WidthAlert, change);
        })}
      >
        <Card
          Key="Card"
          padding={new UDim(0, 12)}
          size={this.adjustedHeight.map(height => {
            return UDim2.fromOffset(Theme.WidthAlert, height);
          })}
          useShadow={false}
        >
          {/* Constraints */}
          <VerticalListConstraint Key="Constraint" padding={new UDim(0, 4)} />
          <TransparencyContext.Provider value={this.infoBundle.get()}>
            <FullLine Key="TitleLine" layoutOrder={0} height={24}>
              {/* Icon */}
              {has_icon && <Icon Key="Icon" color={this.props.iconColor} type={this.props.iconType!} />}

              {/* Title */}
              <Typography
                Key="Title"
                position={UDim2.fromOffset(has_icon ? 40 : 0, 0)}
                text={this.props.title ?? "Alert"}
                type="Subheading"
              />

              {/* Close Button */}
              {this.props.onClose && (
                <IconButton
                  anchorPoint={new Vector2(1, 0)}
                  color={Theme.ColorBlack}
                  onClick={this.props.onClose}
                  size={15}
                  type="Close"
                  position={UDim2.fromScale(1, 0)}
                />
              )}
            </FullLine>

            {/* Message */}
            {this.props.message !== undefined && (
              <FullLine layoutOrder={1} Key="Message" height={this.textHeight.get()}>
                <AdjustableTypography
                  Key="Message"
                  layoutOrder={1}
                  position={UDim2.fromOffset(has_icon ? 40 : 0, 0)}
                  alignmentX={Enum.TextXAlignment.Left}
                  onChanged={(_, height) => this.textHeight.set(height)}
                  text={this.props.message}
                  type="Normal"
                  widthOffset={Theme.WidthAlert - 70}
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
      </frame>
    );
  }

  public willUnmount() {
    this.bin.destroy();
  }
}
