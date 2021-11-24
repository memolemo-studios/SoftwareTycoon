import Roact, { PureComponent } from "@rbxts/roact";
import { App } from "client/controllers/interface/AppController";
import { PopupAlert } from "interface/components/alert/popup";
import { VerticalListConstraint } from "interface/components/constraints/list/vertical";

interface State {
  visible: boolean;
}

@App({
  displayOrder: 5,
  name: "AlertApp",
})
export class AlertApp extends PureComponent<{}, State> {
  public constructor() {
    super({});
    this.setState({ visible: false });
  }

  public didMount() {
    task.delay(5, () => this.setState({ visible: true }));
  }

  public render() {
    return (
      <>
        <VerticalListConstraint
          horizontalAlignment={Enum.HorizontalAlignment.Center}
          verticalAlignment={Enum.VerticalAlignment.Top}
          sortOrder={Enum.SortOrder.LayoutOrder}
        />
        <PopupAlert
          iconType="Checkmark"
          title="Alert app component testing"
          onClose={() => this.setState({ visible: false })}
          message="Alert message testing"
          visible={this.state.visible}
        />
      </>
    );
  }
}
