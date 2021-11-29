import { Dependency } from "@flamework/core";
import { Bin } from "@rbxts/bin";
import Object from "@rbxts/object-utils";
import { CameraController } from "client/controllers/io/CameraController";
import {
  CameraWorkerConfig,
  CameraWorkerHookInfo,
  OnCameraWorkerAttributeChanged,
  OnCameraWorkerRender,
  OnCameraWorkerStart,
} from "client/controllers/io/CameraWorkerController/decorator";
import { Attributes } from "shared/classes/instance/attributes";
import { GameFlags } from "shared/flags";
import { CFrameUtil } from "shared/utils/cframe";
import { VectorUtil } from "shared/utils/vector";

export interface BaseCameraWorkerAttributes {
  position: Vector3;
  rotation: Vector3;
}

export class BaseCameraWorker<T extends BaseCameraWorkerAttributes = BaseCameraWorkerAttributes> {
  protected attributes!: Attributes<T>;
  protected bin = new Bin();
  protected camera?: Camera;
  protected position = new Vector3();
  protected rotation = new Vector3();

  /** @hidden */
  public config!: CameraWorkerConfig;

  /** @hidden */
  public hookInfo!: CameraWorkerHookInfo;

  /**
   * This method only be used for task scheduling events
   * such as `RenderStepped` or `Heartbeat`
   *
   * It allows to update the camera with the render delta time
   * @param delta_time Render delta time
   */
  public update(delta_time: number) {
    if (this.hookInfo.render) {
      (this as unknown as OnCameraWorkerRender).onWorkerRender(delta_time);
    } else {
      // update the camera if possible
      const camera = this.camera;
      if (camera === undefined) return;

      // usual as that right?
      camera.CFrame = CFrameUtil.fromPositionAndRotation(this.position, VectorUtil.toRadians(this.rotation));
    }
  }

  /** Listens debug attributes of the `Camera` instance */
  private listenDebugAttributes() {
    // only truly listen if it is in debug mode
    if (!GameFlags.CameraDebugMode) return;

    // listening to it right?
    const connection = this.attributes!.changed.Connect(changed => {
      // modifications
      switch (changed as keyof BaseCameraWorkerAttributes) {
        case "position":
          this.setPosition(this.attributes.get("position") as unknown as Vector3);
          break;
        case "rotation":
          this.setRotation(this.attributes.get("rotation") as unknown as Vector3);
          break;
        default:
          break;
      }
      // attribute changed hook
      if (this.hookInfo.attributeChanged) {
        (this as unknown as OnCameraWorkerAttributeChanged).onAttributeChanged(changed as string);
      }
    });
    this.bin.add(connection);
  }

  private updateDebugAttributes() {
    // only truly update if it is in debug mode
    if (!GameFlags.CameraDebugMode) return;

    // update attributes
    this.attributes.set("position", this.position);
    this.attributes.set("rotation", this.rotation);

    // attribute changed hook
    if (this.hookInfo.attributeChanged) {
      (this as unknown as OnCameraWorkerAttributeChanged).onAttributeChanged();
    }
  }

  /** Gets the current position */
  public getPosition() {
    return this.position;
  }

  /** Gets the current rotation */
  public getRotation() {
    return this.rotation;
  }

  /** Internal `setPosition` method */
  protected _setPosition(position: Vector3) {
    this.position = position;
  }

  /** Internal `setRotation` method */
  protected _setRotation(rotation: Vector3) {
    this.rotation = rotation;
  }

  /**
   * Sets the position
   * @param position Position to change to
   */
  public setPosition(position: Vector3) {
    this._setPosition(position);
    this.updateDebugAttributes();
  }

  /**
   * Sets the rotation
   * @param rotation Rotation to change to
   */
  public setRotation(rotation: Vector3) {
    this._setRotation(rotation);
    this.updateDebugAttributes();
  }

  /** Sets up the attributes */
  private setupAttributes(camera: Camera) {
    if (!GameFlags.CameraDebugMode) return;

    this.attributes = new Attributes(camera);

    // setting default attributes
    if (this.config.defaultAttributes !== undefined) {
      for (const [key, value] of Object.entries(this.config.defaultAttributes)) {
        this.attributes.set(key as keyof T, value as T[keyof T]);
      }
    }

    this.updateDebugAttributes();
    this.listenDebugAttributes();
  }

  /** Starts the camera worker */
  public start() {
    const controller = Dependency<CameraController>();

    // trying to setup the camera property right now
    const camera_opt = controller.getCamera();
    if (camera_opt.isSome()) {
      this.camera = camera_opt.unwrap();
      this.camera.CameraType = Enum.CameraType.Scriptable;
      this.camera.CameraSubject = undefined;
      this.setupAttributes(this.camera);
    }

    // any camera changes
    this.bin.add(
      controller.onCameraUpdated.Connect(cam => {
        if (this.attributes === undefined) {
          this.setupAttributes(cam);
        } else {
          this.attributes.setInstance(cam);
        }
        this.camera = cam;
        this.camera.CameraSubject = undefined;
        this.camera.CameraType = Enum.CameraType.Scriptable;
      }),
    );

    // run the hook if possible
    if (this.hookInfo.start) {
      (this as unknown as OnCameraWorkerStart).onWorkerStart();
    }

    // wipe attributes after session
    this.bin.add(() => this.attributes?.wipe());
  }

  /** Terminates the session of the worker */
  public terminate() {
    this.bin.destroy();
  }
}
