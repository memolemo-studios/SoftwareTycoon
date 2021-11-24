import Roact, { PureComponent } from "@rbxts/roact";
import { App } from "client/controllers/interface/AppController";
import { ClientStoreState } from "client/store/store";
import { Loading } from "interface/game/apps/loading";
import { AppState } from "types/store/appState";

interface MapStateToProps {
  state: AppState;
}

interface Props extends MapStateToProps {}

@App({
  displayOrder: 4,
  name: "LoadingApp",
  mapStateToProps: (state: ClientStoreState): MapStateToProps => {
    return { state: state.app.state };
  },
})
export class LoadingApp extends PureComponent<Props> {
  public render() {
    return undefined;
    //return <Loading visible={this.props.state === AppState.Loading} />;
  }
}
