import { Dependency } from "@flamework/core";
import { Option } from "@rbxts/rust-classes";
import { RunService, Workspace } from "@rbxts/services";
import type { CharacterController } from "client/controllers/CharacterController";

export default class BasePlacement {
	protected cursor?: Model;

	public constructor(public canvas: BasePart, public targetSurface = Enum.NormalId.Top, public gridUnit = 0) {}

	private validateCursor() {
		return typeIs(this.cursor, "Instance") && this.cursor.IsA("Model") && this.cursor.PrimaryPart !== undefined;
	}

	private constructOverlapParams() {
		const params = new OverlapParams();
		params.FilterType = Enum.RaycastFilterType.Blacklist;

		// we don't know if that module is running from the client or server
		const blacklisted = new Array<Instance>();
		if (RunService.IsClient()) {
			// does it impact on performance? idk
			const char_controller = Dependency<CharacterController>();
			const char_opt = char_controller.getCurrentCharacter();
			if (char_opt.isSome()) {
				blacklisted.push(char_opt.unwrap());
			}
		}

		blacklisted.push(this.canvas);
		params.FilterDescendantsInstances = blacklisted;

		return params;
	}

	/**
	 * Checks for any collisions with the model and the obstacles.
	 * @param model A model with PrimaryPart to detect collisions to
	 * @param params Optional, otherwise it will create its own generated `OverlapParams`
	 * @returns Returns true, if it is colliding with the configured `OverlapParams`
	 */
	public checkForCollisions(params = this.constructOverlapParams()) {
		// get parts within model's PrimaryPart and excluding with `CanCollide/CanTouch` parts
		return this.getCursor().match(
			// prettier-ignore
			model => !Workspace.GetPartsInPart(model.PrimaryPart!, params).filter(v => {
					if (v.IsA("BasePart")) {
						return v.CanCollide || v.CanTouch;
					}
					return false;
				}).isEmpty(),
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
	 * Use to calculate the constrained CFrame of the mode
	 * for placement based on the given canvas
	 *
	 * @param model Model with PrimaryPart
	 * @param position Position to constraint with
	 * @param rotation Rotation in radians
	 */
	public calculatePlacementCF(position: Vector3, rotation: number) {
		// get the info about the surface
		const model = this.cursor!;
		const [surface_cf, size] = this.calculateCanvas();

		// rotate the size so that we can properly constrain to the surface
		let model_size = CFrame.fromEulerAnglesYXZ(0, rotation, 0).mul(model.PrimaryPart!.Size);
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
			x = math.sign(x) * (math.abs(x) - (math.abs(x) % grid_unit) + (half_size.X % grid_unit));
			y = math.sign(y) * (math.abs(y) - (math.abs(y) % grid_unit) + (half_size.Y % grid_unit));
		}

		// return this long formula
		return surface_cf.mul(new CFrame(x, y, -model_size.Y / 2)).mul(CFrame.Angles(-math.pi / 2, rotation, 0));
	}

	/**
	 * Gets the current cursor
	 * @returns Option with a cursor wrapped inside
	 */
	public getCursor(): Option<Model> {
		if (!this.validateCursor()) return Option.none();
		return Option.wrap(this.cursor);
	}

	/**
	 * Sets the current cursor to a new one
	 * @param cursor Valid model cursor otherwise it won't work
	 */
	public setCursor(cursor: Model) {
		this.cursor = cursor;
	}
}