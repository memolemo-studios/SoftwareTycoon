import {
  CameraWorker,
  OnCameraWorkerAttributeChanged,
  OnCameraWorkerRender,
  OnCameraWorkerStart,
} from "client/controllers/io/CameraWorkerController/decorator";
import { Keyboard } from "client/input/keyboard";
import { Mouse } from "client/input/mouse";
import MovementController from "client/input/movement";
import { CFrameUtil } from "shared/utils/cframe";
import { VectorUtil } from "shared/utils/vector";
import { SpringCameraWorker, SpringWorkerAttributes } from "./spring";

interface Attributes extends SpringWorkerAttributes {
  move_speed: number;
  angle_speed: number;
}

@CameraWorker({
  name: "PlacementCameraWorker",
  defaultAttributes: {
    position_damper: 1,
    position_frequency: 20,
    rotation_damper: 1,
    rotation_frequency: 20,
  },
})
export class PlacementCameraWorker
  extends SpringCameraWorker<Attributes>
  implements OnCameraWorkerStart, OnCameraWorkerRender, OnCameraWorkerAttributeChanged
{
  protected movement!: MovementController;
  protected mouse!: Mouse;
  protected keyboard!: Keyboard;

  protected sensitivity = 1;
  protected moveSpeed = 30;
  protected angleSpeed = 140;

  // 0 - not moving
  // 1 or -1 - moving
  protected walkChangeSpeedX = 0;
  protected walkChangeSpeedZ = 0;
  protected angleChangeSpeed = 0;

  /** @override @hidden */
  public onWorkerRender(delta_time: number) {
    // movement controls
    const change_x = this.walkChangeSpeedX * this.moveSpeed * delta_time;
    const change_z = this.walkChangeSpeedZ * this.moveSpeed * delta_time;

    // update the rotation
    const initial_rotation = this.angleChangeSpeed * this.angleSpeed * this.sensitivity * delta_time;
    const final_rotation = new Vector3(this.rotation.X, this.rotation.Y + initial_rotation, this.rotation.Z);

    // move based on the rotation
    const new_cframe = CFrameUtil.fromPositionAndRotation(
      this.positionSpring.goal,
      VectorUtil.toRadians(new Vector3(0, final_rotation.Y, 0)),
    ).mul(new CFrame(-change_x, 0, -change_z));

    this.setPosition(new_cframe.Position);
    this.setRotation(final_rotation);

    // update from super
    super.onWorkerRender(delta_time);
  }

  /** @override @hidden */
  public onAttributeChanged(changed?: keyof Attributes) {
    // inheritance reason
    super.onAttributeChanged(changed as keyof SpringWorkerAttributes);

    // if there's any change set it!
    if (changed !== undefined) {
      switch (changed) {
        case "angle_speed":
          this.moveSpeed = this.attributes.get("move_speed") as unknown as number;
          break;
        case "move_speed":
          this.angleSpeed = this.attributes.get("angle_speed") as unknown as number;
          break;
        default:
          break;
      }
    } else {
      this.attributes.set("move_speed", this.moveSpeed);
      this.attributes.set("angle_speed", this.angleSpeed);
    }
  }

  protected updateRotateChange() {
    // TODO: find a way how to workaround with arrow keys
    if (
      this.keyboard.areAnyKeysDown(Enum.KeyCode.Q, Enum.KeyCode.E) &&
      !this.keyboard.areKeysDown(Enum.KeyCode.Q, Enum.KeyCode.E)
    ) {
      if (this.keyboard.isKeyDown(Enum.KeyCode.Q)) {
        this.angleChangeSpeed = 1;
      }
      if (this.keyboard.isKeyDown(Enum.KeyCode.E)) {
        this.angleChangeSpeed = -1;
      }
    } else {
      this.angleChangeSpeed = 0;
    }
  }

  /** @hidden */
  public onWorkerStart() {
    this.setRotation(new Vector3(-45, 0, 0));
    this.setPosition(new Vector3(0, 20, 0));
    this.positionSpring.angularFrequency = 20;
    this.rotationSpring.angularFrequency = 20;

    // creating input classes
    this.movement = new MovementController(1);
    this.mouse = new Mouse();
    this.keyboard = new Keyboard();

    // cleanups
    this.bin.add(
      this.movement.onMove.Connect((x, z) => {
        this.walkChangeSpeedX = x;
        this.walkChangeSpeedZ = z;
      }),
    );
    this.bin.add(this.keyboard.keyDown.Connect(() => this.updateRotateChange()));
    this.bin.add(this.keyboard.keyUp.Connect(() => this.updateRotateChange()));
    this.bin.add(this.movement);
    this.bin.add(this.mouse);
    this.bin.add(this.keyboard);
  }
}
