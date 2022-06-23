import { Controller, OnInit, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Workspace } from "@rbxts/services";
import { makeListenersSet } from "shared/macros/flamework";

/**
 * Hooks into the `OnCameraChanged` event.
 */
export interface OnCameraChanged {
  /**
   * This method will call whenever `Workspace.CurrentCamera` is changed,
   * because this property can be nil and cause undefined behavior when
   * accessing `Workspace.CurrentCamera` directly without checks.
   *
   * This should only be used if you want to be a safer
   * side of manipulating the camera.
   */
  onCameraChanged(camera: Camera): void;
}

const waitingThreads = new Array<thread>();

@Controller({})
export class CameraController implements OnInit, OnStart {
  private onChanged = makeListenersSet<OnCameraChanged>();
  private logger = Log.ForContext(CameraController);

  // TODO: Move this into a function. An exploiter can modify this method here.
  private onCameraChanged(camera: Camera) {
    this.logger.Verbose("Workspace.CurrentCamera changed");
    this.onChanged.forEach((v) => task.spawn(() => v.onCameraChanged(camera)));
    for (const thread of waitingThreads) {
      task.spawn(() => coroutine.resume(thread));
    }
  }

  /**
   * Gets the current camera safely without relying on
   * rusty nullable object.
   *
   * The downside of this method unlike `CameraController::getCamera` is
   * it will wait for some time if `Workspace.CurrentCamera` is destroyed
   * and generated back by ROBLOX.
   *
   * @returns Promise object with the current camera from `Workspace.CurrentCamera`
   */
  public async waitForCamera(): Promise<Camera> {
    let camera = Workspace.CurrentCamera;
    while (camera === undefined) {
      this.logger.Verbose("Workspace.CurrentCamera is undefined, waiting for it to be regenerated");
      waitingThreads.push(coroutine.running());
      coroutine.yield();
      camera = Workspace.CurrentCamera;
    }
    return camera;
  }

  /**
   * Gets the current camera from `Workspace.CurrentCamera`.
   * @returns Option value that maybe has Camera object inside
   */
  public getCamera() {
    return Option.wrap(Workspace.CurrentCamera);
  }

  /** @hidden */
  public onInit() {
    Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
      const camera = Workspace.CurrentCamera;
      if (!camera) return;
      this.onCameraChanged(camera);
    });
  }

  /** @hidden */
  public onStart() {
    const camera = Workspace.CurrentCamera;
    if (camera !== undefined) {
      this.onCameraChanged(camera);
    }
  }
}
