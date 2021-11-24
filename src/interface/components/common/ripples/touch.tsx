import { GroupMotor, Instant, Spring } from "@rbxts/flipper";
import Roact, { Binding, BindingFunction, Component } from "@rbxts/roact";
import { useInvisibleTransparency } from "shared/utils/interface";
import { MathUtil } from "shared/utils/math";
import { RoactUtil } from "shared/utils/roact";
import { Circle } from "../shapes/circle";
import { BaseRippleMotor, BaseRippleProps } from "./types";

const EXPAND_PROPS = {
  frequency: 7,
  dampingRatio: 2,
};

export class TouchRipple extends Component<BaseRippleProps> {
  private ref = Roact.createRef<Frame>();

  private motor: GroupMotor<BaseRippleMotor>;
  private binding: Binding<BaseRippleMotor>;

  private position: Binding<Vector2>;
  private setPosition: BindingFunction<Vector2>;

  public constructor(props: BaseRippleProps) {
    super(props);
    this.motor = new GroupMotor({
      scale: 0,
      opacity: 0,
    });
    this.binding = RoactUtil.makeBindingFromMotor(this.motor);
    [this.position, this.setPosition] = Roact.createBinding(new Vector2(0, 0));
  }

  public reset() {
    this.motor.setGoal({
      scale: new Instant(0),
      opacity: new Instant(0),
    } as unknown as never);
    this.motor.step(0);
  }

  public calculateRadius(position: Vector2) {
    const container = this.ref.getValue();
    if (container !== undefined) {
      const corner = new Vector2(math.floor(1 - position.X + 0.5), math.floor(1 - position.Y + 0.5));
      const size = container.AbsoluteSize;
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
          InputBegan: (object, input) => {
            if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;

            // reset the binding
            this.reset();

            // get the relative position
            const position = new Vector2(input.Position.X, input.Position.Y);
            const relative_position = position.sub(object.AbsolutePosition).div(object.AbsoluteSize);
            this.setPosition(relative_position);

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
          Key="RippleOverlay"
          anchorPoint={new Vector2(0.5, 0.5)}
          color={this.props.color}
          transparency={transparency}
          position={this.position.map(value => {
            return UDim2.fromScale(value.X, value.Y);
          })}
          size={Roact.joinBindings({
            scale: scale,
            position: this.position,
          }).map(({ scale, position }) => {
            const target_size = this.calculateRadius(position) * 2;
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
          })}
        />
      </frame>
    );
  }
}
