import { Controller, Flamework, OnInit, OnStart } from "@flamework/core";
import { Option } from "@rbxts/rust-classes";
import { Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { FlameworkUtil } from "shared/utils/flamework";
import { BaseCharacterModel } from "types/roblox";
import { CharacterController } from "../player/CharacterController";

/** Hook into the OnCameraUpdated event */
export interface OnCameraUpdated {
  /**
   * This function will be called whenever the `CurrentCamera` property
   * in Workspace is changed.
   *
   * This should only used when mainpulating the camera.
   */
  onCameraUpdated(camera: Camera): void;
}

@Controller({})
export class CameraController implements OnInit, OnStart {
  private connectedUpdate = new Map<string, OnCameraUpdated>();
  private isFCMethodBusy = false;

  /** A signal which it has the same functionality as `OnCameraUpdated` event */
  public onCameraUpdated = new Signal<(camera: Camera) => void>();

  public constructor(private characterController: CharacterController) {}

  /**
   * Gets the `CurrentCamera` from Workspace.
   *
   * The difference is that this method is returned as an Option
   */
  public getCamera() {
    return Option.wrap(Workspace.CurrentCamera);
  }

  private fireCameraUpdated(camera: Camera) {
    this.onCameraUpdated.Fire(camera);
    for (const [, hooker] of this.connectedUpdate) {
      task.spawn(() => hooker.onCameraUpdated(camera));
    }
  }

  /**
   * Attempts the camera to focus on the character
   *
   * **NOTE**: It won't work if it calls for multiple times to
   * prevent memory leaks and unexpected calls.
   *
   * **Useful for**:
   *  - Terminating camera worker
   *  - and don't know what are benefits, but you get the point.
   */
  public focusToCharacter() {
    if (this.isFCMethodBusy) return;

    // creating a function to do this for me
    const on_character_spawned = (character: BaseCharacterModel) =>
      this.getCamera().match(
        cam => {
          cam.CameraSubject = character.Humanoid;
          cam.CameraType = Enum.CameraType.Custom;
        },
        () => {},
      );

    // character
    this.characterController.getCurrentCharacter().match(on_character_spawned, () => {
      let conn: RBXScriptConnection;
      // eslint-disable-next-line prefer-const
      conn = this.characterController.onCharacterAdded.Connect(c => {
        conn.Disconnect();
        on_character_spawned(c);
      });
    });
  }

  /** @hidden */
  public onInit() {
    // get connected update hookers
    this.connectedUpdate = FlameworkUtil.getDependencySingletons(ctor => Flamework.implements<OnCameraUpdated>(ctor));

    // any changes to the camera
    Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
      this.fireCameraUpdated(Workspace.CurrentCamera!);
    });
  }

  /** @hidden */
  public onStart() {
    // fire all of the onCameraUpdated hookers
    const camera = Workspace.CurrentCamera;
    if (camera !== undefined) {
      this.fireCameraUpdated(camera);
    }
  }
}
