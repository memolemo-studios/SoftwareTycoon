import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import Theme from "interface/definitions/theme";
import { GameFlags } from "shared/flags";
import { MathUtil } from "shared/utils/math";
import { RoactUtil } from "shared/utils/roact";
import { ValueOrBinding } from "types/roact";
import { Icon } from "../icon/default";
import { StaticRipple } from "../ripples/static";
import { Circle } from "../shapes/circle";

interface Props {
  checked?: boolean;
  layoutOrder?: ValueOrBinding<number>;
  onClick?: () => void;
  type: Theme.TypesToggleSwitch;
}

interface State {
  clicked: boolean;
}

/** Toggle switch, what an important thing */
export class ToggleSwitch extends Component<Props, State> {
  private motor: SingleMotor;
  private binding: Binding<number>;

  private overlayMotor: SingleMotor;
  private overlay: Binding<number>;

  public constructor(props: Props) {
    super(props);
    this.motor = new SingleMotor(this.props.checked ? 1 : 0);
    this.binding = RoactUtil.makeBindingFromMotor(this.motor);
    this.overlayMotor = new SingleMotor(0);
    this.overlay = RoactUtil.makeBindingFromMotor(this.overlayMotor);
  }

  public setClicked(hovered: boolean) {
    this.setState({ clicked: hovered });
  }

  public didUpdate(last_props: Props) {
    if (this.props.checked !== last_props.checked) {
      this.motor.setGoal(
        new Spring(this.props.checked ? 1 : 0, {
          frequency: 7,
          dampingRatio: 1,
        }),
      );
    }
  }

  public render() {
    const inner_circle_color = Theme.ColorsToggleSwitchInner[this.props.type];
    const final_extended_size = new UDim2(
      1,
      Theme.RadiusIconButtonExtendedOverlay,
      1,
      Theme.RadiusIconButtonExtendedOverlay,
    );
    return (
      <frame
        BackgroundColor3={Theme.ColorsToggleSwitchBackground[this.props.type]}
        Event={{
          InputBegan: (_, input) => {
            // do not do something if it is disabled in type prop
            if (this.props.type === "Disabled") return;
            if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
            this.setClicked(true);

            let conn: RBXScriptConnection;
            // eslint-disable-next-line prefer-const
            conn = input.GetPropertyChangedSignal("UserInputState").Connect(() => {
              const state = input.UserInputState;
              if (state === Enum.UserInputState.Cancel || state === Enum.UserInputState.End) {
                conn.Disconnect();
                this.props.onClick?.();
                this.setClicked(false);
              }
            });
          },
          MouseEnter: () => this.overlayMotor.setGoal(new Spring(1, GameFlags.InterfaceSpringProps)),
          MouseLeave: () => this.overlayMotor.setGoal(new Spring(0, GameFlags.InterfaceSpringProps)),
        }}
        LayoutOrder={this.props.layoutOrder}
        Size={UDim2.fromOffset(80, Theme.SizeToggleSwitchInnerCircle + Theme.SizeToggleSwitchGap)}
      >
        <uicorner Key="Constraint" CornerRadius={new UDim(1, 0)} />
        <Icon
          Key="Circle"
          anchorPoint={new Vector2(0.5, 0.5)}
          color={inner_circle_color}
          position={this.binding.map(alpha => {
            const gap =
              (Theme.SizeToggleSwitchInnerCircle / 2 + math.round(Theme.SizeToggleSwitchGap / 2)) *
              MathUtil.lerp(1, -1, alpha);
            return new UDim2(alpha, gap, 0.5, 0);
          })}
          size={UDim2.fromOffset(Theme.SizeToggleSwitchInnerCircle, Theme.SizeToggleSwitchInnerCircle)}
          type="Circle"
        >
          <Circle
            Key="Overlay"
            anchorPoint={new Vector2(0.5, 0.5)}
            color={inner_circle_color}
            position={UDim2.fromScale(0.5, 0.5)}
            size={UDim2.fromOffset(
              Theme.SizeToggleSwitchInnerCircle + Theme.RadiusIconButtonExtendedOverlay,
              Theme.SizeToggleSwitchInnerCircle + Theme.RadiusIconButtonExtendedOverlay,
            )}
            transparency={this.overlay.map(alpha => MathUtil.lerp(1, 0.8, alpha))}
          />
          <StaticRipple
            Key="Ripple"
            anchorPoint={new Vector2(0.5, 0.5)}
            color={inner_circle_color}
            enabled={this.state.clicked}
            position={UDim2.fromScale(0.5, 0.5)}
            size={final_extended_size}
            rippleRadius={Theme.SizeToggleSwitchInnerCircle + Theme.RadiusIconButtonExtendedOverlay}
            ripplePosition={UDim2.fromScale(0.5, 0.5)}
            useInput={false}
            zIndex={2}
          />
        </Icon>
      </frame>
    );
  }
}
