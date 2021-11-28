import { Option } from "@rbxts/rust-classes";
import Spring from "@rbxts/spring";
import { t } from "@rbxts/t";
import { modelCFramer, ModelCFramer } from "shared/functions/modelCFramer";
import { CFrameUtil } from "shared/utils/cframe";

const cursor_check = t.union(
  t.instanceIsA("BasePart"),
  t.intersection(
    t.instanceOf("Model"),
    t.interface({
      PrimaryPart: t.instanceIsA("BasePart"),
    }),
  ),
);

/**
 * This class helps to move the cursor using spring animations
 * with rotation as well.
 *
 * You can also turn off interpolation to avoid smooth animations.
 */
export class CursorSpring {
  public readonly positionSpring = new Spring(new Vector3());
  public readonly rotationSpring = new Spring(new Vector3());

  private modelCFramer?: ModelCFramer;
  private canInterpolate = false;

  /**
   * Creates a new CursorSpring
   *
   * **Beware (For models only)**: The `updateCursor` method will not work if you don't have a valid
   * model property with PrimaryPart property in it.
   *
   * It uses `SetPrimaryPartCFrame` method to do this.
   * @param cursor Model with PrimaryPart required
   */
  public constructor(private cursor?: Model | BasePart) {}

  /** Gets the current cursor */
  public getCursor() {
    return Option.wrap(this.cursor);
  }

  /** Sets the current cursor */
  public setCursor(cursor: Model | BasePart | undefined) {
    this.cursor = cursor;
    if (cursor === undefined) {
      this.modelCFramer?.delete();
      this.modelCFramer = undefined;
    } else if (cursor.IsA("Model")) {
      this.modelCFramer?.delete();
      this.modelCFramer = modelCFramer(cursor);
    }
  }

  /** Checks if that cursor is valid enough */
  private isValidCursor() {
    return cursor_check(this.cursor);
  }

  /**
   * This method only be used for task scheduling events
   * such as `RenderStepped` or `Heartbeat`
   *
   * It allows to update the model without needing to update the springs
   */
  public updateModel() {
    // because interpolation can be optional, we can only use getter methods
    const position = this.getPosition();
    const rotation = this.getRotation();

    // disallow if that model is not a real validated model
    if (!this.isValidCursor()) return;

    // create CFrame stuff
    const final_cframe = CFrameUtil.fromPositionAndRotation(position, rotation);
    if (this.cursor!.IsA("Model")) {
      this.cursor!.SetPrimaryPartCFrame(final_cframe);
    } else {
      this.cursor!.CFrame = final_cframe;
    }
  }

  /**
   * This method can only be used for task scheduling events
   * such as `RenderStepped` or `Heartbeat`
   *
   * It allows to update the position and rotation springs and model altogether
   * @param delta_time Render delta time
   */
  public update(delta_time: number) {
    // update springs
    this.positionSpring.update(delta_time);
    this.rotationSpring.update(delta_time);

    // update the model as well
    this.updateModel();
  }

  /**
   * Sets if it can be interpolated
   * @param bool Boolean to enable/disable interpolation
   */
  public setInterpolated(bool: boolean) {
    this.canInterpolate = bool;
  }

  /** Gets the current spring position (unless it can be interpolated) */
  public getPosition() {
    if (!this.canInterpolate) return this.positionSpring.goal;
    return this.positionSpring.position;
  }

  /**
   * Sets the position (goal rather) to the current one based on the argument
   * @param position New position to have transition
   */
  public setPosition(position: Vector3) {
    this.positionSpring.goal = position;
  }

  /**
   * Gets the current spring rotation (unless it can be interpolated)
   */
  public getRotation() {
    if (!this.canInterpolate) return this.rotationSpring.goal;
    return this.rotationSpring.position;
  }

  /**
   * Sets the rotation (goal rather) to the current one based on the argument
   * @param rotation New rotation to have transition
   */
  public setRotation(position: Vector3) {
    this.rotationSpring.goal = position;
  }

  /** Cleanups the entire class */
  public cleanup() {
    this.modelCFramer?.delete();
    setmetatable(this, undefined as unknown as LuaMetatable<typeof this>);
  }
}
