import Spring from "@rbxts/spring";
import {
  CameraWorker,
  OnCameraWorkerAttributeChanged,
  OnCameraWorkerRender,
} from "client/controllers/io/CameraWorkerController/decorator";
import { CFrameUtil } from "shared/utils/cframe";
import { VectorUtil } from "shared/utils/vector";
import { BaseCameraWorker, BaseCameraWorkerAttributes } from "./base";

export interface SpringWorkerAttributes extends BaseCameraWorkerAttributes {
  position_damper: number;
  rotation_damper: number;
  position_frequency: number;
  rotation_frequency: number;
}

@CameraWorker({
  name: "SpringCameraWorker",
  defaultAttributes: {
    position_damper: 1,
    position_frequency: 20,
    rotation_damper: 1,
    rotation_frequency: 20,
  },
})
export class SpringCameraWorker<T extends SpringWorkerAttributes = SpringWorkerAttributes>
  extends BaseCameraWorker<T>
  implements OnCameraWorkerAttributeChanged, OnCameraWorkerRender
{
  protected positionSpring = new Spring(this.position);
  protected rotationSpring = new Spring(this.rotation);

  // @override
  protected _setPosition(position: Vector3) {
    this.position = position;
    this.positionSpring.goal = position;
  }

  // @override
  protected _setRotation(rotation: Vector3) {
    this.rotation = rotation;
    this.rotationSpring.goal = rotation;
  }

  /** @hidden */
  public onWorkerRender(delta_time: number) {
    // update all of the springs
    this.positionSpring.update(delta_time);
    this.rotationSpring.update(delta_time);

    // adjust the camera
    const camera = this.camera;
    if (camera === undefined) return;
    camera.CFrame = CFrameUtil.fromPositionAndRotation(
      this.positionSpring.position,
      VectorUtil.toRadians(this.rotationSpring.position),
    );
  }

  /** @hidden */
  public onAttributeChanged(changed?: keyof SpringWorkerAttributes) {
    // if there's any change set it!
    if (changed !== undefined) {
      switch (changed) {
        case "position_damper":
          this.positionSpring.dampingRatio = this.attributes.get("position_damper") as unknown as number;
          break;
        case "position_frequency":
          this.positionSpring.angularFrequency = this.attributes.get("position_frequency") as unknown as number;
          break;
        case "rotation_damper":
          this.rotationSpring.dampingRatio = this.attributes.get("rotation_damper") as unknown as number;
          break;
        case "rotation_frequency":
          this.rotationSpring.angularFrequency = this.attributes.get("rotation_frequency") as unknown as number;
          break;
        default:
          break;
      }
    } else {
      this.attributes.set("position_damper", this.positionSpring.dampingRatio);
      this.attributes.set("position_frequency", this.positionSpring.angularFrequency);
      this.attributes.set("rotation_damper", this.rotationSpring.dampingRatio);
      this.attributes.set("rotation_frequency", this.rotationSpring.angularFrequency);
    }
  }
}
