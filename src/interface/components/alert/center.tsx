import { Bin } from "@rbxts/bin";
import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Binding, Component } from "@rbxts/roact";
import { GameFlags } from "shared/flags";
import { RoactUtil } from "shared/utils/roact";
import { ValueOrBinding } from "types/roact";
import { Card } from "../card";

interface State {
  rendered: boolean;
}

interface Props {
  color?: ValueOrBinding<Color3>;
  ref?: Roact.Ref<Frame>;
  padding?: UDim;
  size?: Vector2;
  transparency?: ValueOrBinding<number>;
  visible?: ValueOrBinding<boolean>;
}

export class CenteredCard extends Component<Props, State> {
  private bin = new Bin();

  private motor: SingleMotor;
  private binding: Binding<number>;

  public constructor(props: Props) {
    super(props);

    const visible = RoactUtil.getBindableValue(this.props.visible ?? false);
    this.motor = new SingleMotor(visible ? 1 : 0);
    this.binding = RoactUtil.makeBindingFromMotor(this.motor);

    const connection = this.motor.onStep(alpha => {
      // it is now not rendered
      if (alpha === 0) {
        this.setState({
          rendered: false,
        });
      }
    });

    this.setState({ rendered: visible });
    this.bin.add(() => connection.disconnect());
  }

  public didUpdate(last_props: Props) {
    // do not update if visible property is not changed
    if (last_props.visible === this.props.visible) return;
    this.motor.setGoal(new Spring(this.props.visible ? 1 : 0, GameFlags.InterfaceSpringProps));
  }

  public render() {
    if (!this.state.rendered) return undefined;
    return (
      <Card
        anchorPoint={new Vector2(0.5, 0.5)}
        color={this.props.color}
        padding={this.props.padding}
        position={UDim2.fromScale(0.5, 0.5)}
        ref={this.props.ref}
        size={this.binding.map(alpha => {
          print(alpha);
          // prettier-ignore
          return UDim2.fromOffset(
            (this.props.size?.X ?? 0) * alpha,
            (this.props.size?.Y ?? 0) * alpha
          );
        })}
      >
        {this.props[Roact.Children]}
      </Card>
    );
  }

  public willUnmount() {
    this.bin.destroy();
  }
}
