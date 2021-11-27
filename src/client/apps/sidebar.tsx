import Roact, { PureComponent } from "@rbxts/roact";
import { App } from "client/controllers/interface/AppController";
import { TestDataComponent } from "client/interface/test";
import { Sidebar } from "interface/game/apps/sidebar";
import { AppState } from "types/store/appState";

@App({
  name: "ToolbarApp",
  showInAppState: [AppState.None],
})
export class SidebarApp extends PureComponent {
  public render() {
    return (
      <>
        <Sidebar visible={true} />
        <TestDataComponent />
      </>
    );
  }
}
