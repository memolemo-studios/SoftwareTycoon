/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Flamework, OnInit, OnStart, Reflect } from "@flamework/core";
import { Bin } from "@rbxts/bin";
import Log from "@rbxts/log";
import Roact, { mount, unmount } from "@rbxts/roact";
import { connect, StoreProvider } from "@rbxts/roact-rodux";
import { Dispatch } from "@rbxts/rodux";
import { Result } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { AlertApp } from "client/apps/alert";
import type { LoadingApp } from "client/apps/loading";
import { ClientStore, ClientStoreActions, ClientStoreState } from "client/store/store";
import { FlameworkUtil } from "shared/utils/flamework";
import { DecoratorMetadata } from "types/flamework";
import { AppState } from "types/store/appState";

interface AppConfig {
  name: string;
  displayOrder?: number;
  mapStateToProps?: (state: ClientStoreState) => object;
  mapDispatchToProps?: (dispatch: Dispatch<ClientStoreActions>) => object;
  showInAppState?: AppState[];
}

interface RegisteredAppInfo {
  component: Roact.ComponentConstructor;
  config: AppConfig;
}

/** Register a class as an App */
export declare function App(cfg: AppConfig): any;

const app_decorator_id = FlameworkUtil.DECORATOR_PREFIX + Flamework.id<typeof App>();
const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui");

@Controller({ loadOrder: 0 })
export class AppController implements OnInit, OnStart {
  private apps = new Map<string, RegisteredAppInfo>();
  private bin = new Bin();
  private logger = Log.ForContext(AppController);
  private roactTreeApps = new Map<string, Roact.Tree>();

  /**
   * Attempts to unmount an app from an app's flamework id
   * **NOTE**: If that app doesn't exists or it is already unmounted, it will show out an error.
   * @param id
   */
  public unmountApp(id: string): Result<true, string> {
    const tree = this.roactTreeApps.get(id);
    if (tree === undefined) {
      // cmdr
      const output = this.logger.Error("Attempted to unmount an invalid or unmounted app: {Id}", id);
      return Result.err(output ?? "Unknown error");
    }
    unmount(tree);
    this.logger.Info("Unmounting {AppName} app ({AppId})", this.apps.get(id)!.config.name, id);
    this.roactTreeApps.delete(id);
    return Result.ok(true);
  }

  /**
   * Attempts to mount an app from an app's flamework id
   *
   * **NOTE**: If that app doesn't exists or it is already mounted, it will show out an error.
   * @param id App flamework id
   */
  public mountApp(id: string): Result<true, string> {
    // trying to get an app info
    const info = this.apps.get(id);
    if (info === undefined) {
      const output = this.logger.Error("Attempted to mount an invalid app: {Id}", id);
      return Result.err(output ?? "Unknown error");
    }

    // make sure it is not already mounted
    if (this.roactTreeApps.has(id)) {
      const output = this.logger.Error("{Id} app is already mounted!", id);
      return Result.err(output ?? "Unknown error");
    }

    // attempting to mount a Roact app...
    const config = info.config;
    const tree = mount(
      <StoreProvider store={ClientStore}>
        <screengui DisplayOrder={config.displayOrder} ResetOnSpawn={false}>
          <info.component />
        </screengui>
      </StoreProvider>,
      player_gui,
      config.name,
    );

    this.logger.Info("Mounting {AppName} app ({AppId})", config.name, id);
    this.roactTreeApps.set(id, tree);

    return Result.ok(true);
  }

  /** @hidden */
  public onStart() {
    // automatically mounting an app if 'showInAppState' property does exists
    const current_state = ClientStore.getState().app.state;
    for (const [app_id, info] of this.apps) {
      const config = info.config;
      if (config.showInAppState === undefined) continue;

      // automatic visiblity
      const updater = (state: AppState) => {
        const can_be_visible = config.showInAppState!.some(v => v === state);
        if (can_be_visible) {
          this.mountApp(app_id);
        } else if (this.isAppMounted(app_id)) {
          this.unmountApp(app_id);
        }
      };
      const connection = ClientStore.changed.connect(new_state => updater(new_state.app.state));
      this.bin.add(() => connection.disconnect());
      updater(current_state);
    }
  }

  /**
   * A helper method returns if that app is mounted
   *
   * **NOTE**: If that app doesn't exists, it will show out an error.
   * @param id App flamework id
   */
  public isAppMounted(id: string) {
    // trying to get an app info
    const info = this.apps.get(id);
    if (info === undefined) {
      return this.logger.Error("Attempted to get isAppMounted boolean result of invalid app: {Id}", id) as void;
    }
    return this.roactTreeApps.has(id);
  }

  /** @hidden */
  public onInit() {
    // get all of the app classes
    for (const [id, ctor] of Reflect.idToObj) {
      // get the app's decorator metadata (if possible)
      const config = Reflect.getOwnMetadata<DecoratorMetadata<[AppConfig]>>(ctor, app_decorator_id)?.arguments[0];
      if (config === undefined) continue;

      // it shouldn't be the same name, otherwise it will be ignored
      if (this.apps.has(config.name)) {
        this.logger.Fatal("Duplicated app name: {AppName}! {Conflict} class will be ignored", config.name, id);
        continue;
      }

      // time to make a registered app info!
      let component = ctor as Roact.ComponentConstructor;
      if (config.mapStateToProps !== undefined) {
        const noop_dispatch = config.mapDispatchToProps ?? (() => ({}));
        component = connect(config.mapStateToProps, noop_dispatch)(component);
      }

      // registrating apps
      this.logger.Debug("Registered app: {AppId}", id);
      this.apps.set(id, { component, config });
    }

    // show loading app in advance
    // this.mountApp(Flamework.id<LoadingApp>());
    // this.mountApp(Flamework.id<AlertApp>());
  }
}
