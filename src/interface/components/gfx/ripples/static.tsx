// stole from touch ripple, bruh...

import { GroupMotor, Instant, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import { mapBindableProp } from "interface/utils/mapBindableProp";
import { useInvisibleTransparency } from "shared/utils/interface";
import { MathUtil } from "shared/utils/math";
import { RoactUtil } from "shared/utils/roact";
import { ValueOrBinding } from "types/roact";
import { Circle } from "../circle";

interface Props {
  anchorPoint?: ValueOrBinding<Vector2>;
  color?: ValueOrBinding<Color3>;
  position?: ValueOrBinding<UDim2>;
  rippleRadius?: ValueOrBinding<number>;
  ripplePosition: UDim2;
  size?: ValueOrBinding<UDim2>;
  zIndex?: ValueOrBinding<number>;
}

interface RippleMotor {
  scale: number;
  opacity: number;
}

const EXPAND_PROPS = {
  frequency: 7,
  dampingRatio: 2,
};

export class StaticRipple extends Component<Props> {
  private ref = Roact.createRef<Frame>();

  private motor: GroupMotor<RippleMotor>;
  private binding: Binding<RippleMotor>;

  public constructor(props: Props) {
    super(props);
    this.motor = new GroupMotor({
      scale: 0,
      opacity: 0,
    });
    this.binding = RoactUtil.makeBindingFromMotor(this.motor);
  }

  public reset() {
    this.motor.setGoal({
      scale: new Instant(0),
      opacity: new Instant(0),
    } as unknown as never);
    this.motor.step(0);
  }

  public calculateRadius(raw_position: UDim2) {
    const container = this.ref.getValue();

    if (container !== undefined) {
      // calculate final position based on the position udmi2
      const size = container.AbsoluteSize;
      const offset_position = new Vector2(
        raw_position.X.Scale * size.X + raw_position.X.Offset,
        raw_position.Y.Scale * size.Y + raw_position.Y.Offset,
      );
      const position = offset_position.div(size);
      const corner = new Vector2(math.floor(1 - position.X + 0.5), math.floor(1 - position.Y + 0.5));
      const ratio = size.div(math.min(size.X, size.Y));
      return corner.mul(ratio).sub(position.mul(ratio)).Magnitude;
    }
    return 0;
  }

  public render() {
    const scale = this.binding.map(info => info.scale);
    const transparency = this.binding
      .map(info => info.opacity)
      .map(v => {
        return MathUtil.lerp(0.8, 1, 1 - v);
      });
    return (
      <frame
        AnchorPoint={this.props.anchorPoint}
        BackgroundTransparency={useInvisibleTransparency()}
        ClipsDescendants={true}
        Event={{
          InputBegan: (_, input) => {
            if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;

            // reset the binding
            this.reset();

            // move ahead
            this.motor.setGoal({
              scale: new Spring(1, EXPAND_PROPS),
              opacity: new Spring(1, EXPAND_PROPS),
            } as unknown as never);

            let conn: RBXScriptConnection;
            // eslint-disable-next-line prefer-const
            conn = input.GetPropertyChangedSignal("UserInputState").Connect(() => {
              const state = input.UserInputState;
              if (state === Enum.UserInputState.Cancel || state === Enum.UserInputState.End) {
                this.motor.setGoal({
                  opacity: new Spring(0, { frequency: 5, dampingRatio: 1 }),
                } as unknown as never);
                conn.Disconnect();
              }
            });
          },
        }}
        Ref={this.ref}
        Position={this.props.position}
        Size={this.props.size}
        ZIndex={this.props.zIndex}
      >
        <Circle
          anchorPoint={new Vector2(0.5, 0.5)}
          color={this.props.color}
          transparency={transparency}
          position={this.props.ripplePosition}
          size={
            this.props.rippleRadius !== undefined
              ? scale.map(alpha => {
                  let ripple_radius = 0;
                  mapBindableProp(this.props.rippleRadius!, size => {
                    ripple_radius = size;
                  });
                  return UDim2.fromOffset(ripple_radius * alpha, ripple_radius * alpha);
                })
              : Roact.joinBindings({
                  scale: scale,
                }).map(({ scale }) => {
                  let position: UDim2 | undefined;
                  mapBindableProp(this.props.ripplePosition, value => {
                    position = value;
                  });
                  const target_size = this.calculateRadius(position!) * 2;
                  const current_size = target_size * scale;
                  const container = this.ref.getValue();

                  // default to UDim2.fromOffset(0, 0)
                  if (container === undefined) return UDim2.fromOffset(0, 0);

                  const container_size = container.AbsoluteSize;
                  const container_ratio = container_size.X / container_size.Y;
                  return UDim2.fromScale(
                    current_size / math.max(container_ratio, 1),
                    current_size * math.min(container_ratio, 1),
                  );
                })
          }
        />
      </frame>
    );
  }
}
