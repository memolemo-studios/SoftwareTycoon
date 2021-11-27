import { Option } from "@rbxts/rust-classes";
import { Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";

const cursor_check: t.check<Model | BasePart> = t.union(t.instanceOf("Model"), t.instanceIsA("BasePart"));

/**
 * Bare bones of the placement class.
 *
 * **Source**: https://devforum.roblox.com/t/creating-a-furniture-placement-system/205509/2
 */
export class BasePlacement {
  private cursor?: Model | BasePart;
  public raycastParams?: RaycastParams;

  public gridUnit = 0;
  public targetSurface: Enum.NormalId = Enum.NormalId.Top;

  /**
   * Creates a new placement class, it requires canvas to do this
   * and cannot be changed
   */
  public constructor(public canvas: BasePart) {}

  /** Validates if the cursor is valid or not */
  public validateCursor() {
    const valid = cursor_check(this.cursor);
    if (valid) {
      return this.cursor!.IsA("Model") ? this.cursor.PrimaryPart !== undefined : true;
    }
    return false;
  }

  /**
   * Tries to get the root part of either the PrimaryPart
   * of the model or the part.
   */
  public getRootPart(): Option<BasePart> {
    const that = this.cursor;
    if (!this.validateCursor()) {
      return Option.none();
    }
    if (that!.IsA("Model")) {
      return Option.some(that.PrimaryPart!);
    }
    return Option.some(that!);
  }

  /**
   * Checks for any collisions with the model and the obstacles.
   * @param model A model with PrimaryPart to detect collisions to
   * @param params Optional, otherwise it will create its own generated `OverlapParams`
   * @returns Returns true, if it is colliding with the configured `OverlapParams`
   */
  public checkForCollisions(params?: OverlapParams) {
    // get parts within model's PrimaryPart and excluding with `CanCollide/CanTouch` parts
    return this.getRootPart().match(
      // prettier-ignore
      part => !Workspace.GetPartsInPart(part, params).filter(v => (
          v.IsA("BasePart")
            ? (v.CanCollide || v.CanTouch)
            : false
      )).isEmpty(),
      () => false,
    );
  }

  /**
   * Use to find the boundaries and CFrame we need to place object
   * on a surface
   * @returns `[Canvas cframe, Canvas boundaries]`
   */
  public calculateCanvas() {
    const canvas_size = this.canvas.Size;

    const up = new Vector3(0, 1, 0);
    const back = Vector3.FromNormalId(this.targetSurface).mul(-1);

    // if we are using the top or bottom, then we treat right as up
    const dot = back.Dot(new Vector3(0, 1, 0));
    const axis = math.abs(dot) === 1 ? new Vector3(-dot, 0, 0) : up;

    // rotate around the axis by 90 degress to get right vector
    const right = CFrame.fromAxisAngle(axis, math.pi / 2).mul(back);

    // use the cross product to find the final vector
    const top = back.Cross(right).Unit;

    // convert to world space
    const cf = this.canvas.CFrame.mul(CFrame.fromMatrix(back.mul(-1).mul(canvas_size.div(2)), right, top, back));

    // use object space vectors to find the width and height
    const size = new Vector2(canvas_size.mul(right).Magnitude, canvas_size.mul(top).Magnitude);
    return [cf, size] as const;
  }

  /**
   * Calculate x and y grid locked coordinates, useful for other placement methods
   * like wall, and furniture placing.
   *
   * @param x X position
   * @param y Y position
   * @returns [X, Y] coordinates
   */
  protected calculateXYGrid(x: number, y: number, half_size: Vector2) {
    const grid_unit = this.gridUnit;
    const final_x = math.sign(x) * (math.abs(x) - (math.abs(x) % grid_unit) + (half_size.X % grid_unit));
    const final_y = math.sign(y) * (math.abs(y) - (math.abs(y) % grid_unit) + (half_size.Y % grid_unit));
    return [final_x, final_y] as const;
  }

  /**
   * Use to calculate the constrained CFrame of the mode
   * for placement based on the given canvas
   *
   * @param model Model with PrimaryPart
   * @param position Position to constraint with
   * @param rotation Rotation in radians
   */
  public calculatePlacementCF(position: Vector3, rotation = 0) {
    // get the info about the surface
    const main_part = this.getRootPart().expect("Failed to get either 'PrimaryPart' or 'Part'");
    const [surface_cf, size] = this.calculateCanvas();

    // rotate the size so that we can properly constrain to the surface
    let model_size = CFrame.fromEulerAnglesYXZ(0, rotation, 0).mul(main_part.Size);
    model_size = new Vector3(math.abs(model_size.X), math.abs(model_size.Y), math.abs(model_size.Z));

    // get the position relative to the surface's CFrame
    const relative_pos = surface_cf.PointToObjectSpace(position);

    // the max bounds the model can be from the surface's center
    const half_size = size.sub(new Vector2(model_size.X, model_size.Z)).div(2);

    // constrain the position using half_size
    let x = math.clamp(relative_pos.X, -half_size.X, half_size.X);
    let y = math.clamp(relative_pos.Y, -half_size.Y, half_size.Y);

    // grid unit
    const grid_unit = this.gridUnit;
    if (grid_unit > 0) {
      [x, y] = this.calculateXYGrid(x, y, half_size);
    }

    // return this long formula
    return surface_cf.mul(new CFrame(x, y, -model_size.Y / 2)).mul(CFrame.Angles(-math.pi / 2, rotation, 0));
  }

  /**
   * Gets the current cursor
   * @returns Option with a cursor wrapped inside
   */
  public getCursor(): Option<Model | BasePart> {
    if (!this.validateCursor()) return Option.none();
    return Option.wrap(this.cursor);
  }

  /**
   * Sets the current cursor to a new one
   * @param cursor Valid model cursor otherwise it won't work
   */
  public setCursor(cursor: Model | BasePart) {
    this.cursor = cursor;
  }
}
