import { Dependency } from "@flamework/core";
import { CameraController } from "client/controllers/CameraController";
import { $instance } from "rbxts-transformer-fs";
import CFrameUtil from "shared/util/cframe";
import MathUtil from "shared/util/math";
import ClientBasePlacement from "./base";

export enum WallPlacementState {
	Head = "Head",
	Tail = "Tail",
}

const WALL_ROD = $instance<Model>("assets/game/placement/WallRod.rbxmx");

export default class WallPlacement extends ClientBasePlacement {
	protected state = WallPlacementState.Head;
	protected wallTemp?: Part;
	protected headPosition = new Vector3();

	/**
	 * Gets the current state of the placement
	 * @returns Current wall state (WallPlacementState)
	 */
	public getState() {
		return this.state;
	}

	// override
	protected canRotate = false;

	protected updateGhostTemp() {
		// construct a line cframe if it is in tail state
		if (this.state === WallPlacementState.Tail) {
			const [line_cf, line_size] = CFrameUtil.makeLine(this.headPosition, this.modelSpring.getPosition());
			if (this.wallTemp) {
				this.wallTemp.CFrame = line_cf;
				this.wallTemp.Size = new Vector3(1, 12, line_size);
			}
		}
	}

	// override
	public update(deltaTime: number) {
		// do not update if it is not started
		if (!this.isStarted) return;

		// do exact thing with the base placement
		this.updatePosition();
		this.updateRotation();

		// update the head and tail ghost part
		this.updateGhostTemp();

		// update the model spring
		this.modelSpring.update(deltaTime);
	}

	// override
	public start() {
		if (this.isStarted) return;
		this.isStarted = true;

		// create a new wall temp part
		const wall_temp = new Instance("Part");
		wall_temp.Anchored = true;
		wall_temp.CanCollide = false;
		wall_temp.Transparency = 0.9;
		wall_temp.BrickColor = new BrickColor("Light blue");
		wall_temp.Material = Enum.Material.Neon;
		this.wallTemp = wall_temp;

		// create a wall rod
		const new_wall_rod = WALL_ROD.Clone();

		// mouse
		this.bin.add(this.mouse.leftDown.Connect(() => this.onMouseClick()));

		// camera location
		Dependency<CameraController>()
			.getCamera()
			.match(
				cam => {
					new_wall_rod.Parent = cam;
					wall_temp.Parent = cam;
				},
				() => {},
			);

		this.setCursor(new_wall_rod);
	}

	// tail -> end | head
	protected fromTail() {
		// checking for the valid distance
		const tail_position = this.modelSpring.getPosition();
		const distance = this.headPosition.sub(tail_position).Magnitude;

		this.backToHead();
		if (distance > 0) {
			this.isStarted = false;
		}
	}

	// tail -> head
	protected backToHead() {
		const temp = this.wallTemp;
		this.state = WallPlacementState.Head;
		this.headPosition = new Vector3();
		if (temp !== undefined) {
			temp.Transparency = 1;
		}
	}

	// head -> tail
	protected fromHead() {
		// we're going to care about collision detect system later
		const temp = this.wallTemp;
		this.state = WallPlacementState.Tail;
		this.headPosition = this.modelSpring.getPosition();
		if (temp !== undefined) {
			temp.Transparency = 0.9;
		}
	}

	// for transition from head to tail state
	protected onMouseClick() {
		switch (this.state) {
			case WallPlacementState.Head:
				return this.fromHead();
			case WallPlacementState.Tail:
				return this.fromTail();
			default:
				error("Invalid state, did someone exploit this?");
		}
	}

	// override
	public calculatePlacementCF(position: Vector3) {
		// get the cursor information
		const model = this.cursor!;
		const model_size = model.PrimaryPart?.Size ?? new Vector3();

		// calculate the surface's actual CFrame and size
		const [surface_cf, surface_size] = this.calculateCanvas();

		// convert native position relative to the surface's CFrame
		const relative_pos = surface_cf.PointToObjectSpace(position);

		// get the max bounds divided by 2
		const half_size = surface_size.div(2);

		// we don't need to worry about model constrains
		// because we're going to build a wall anyway
		let x = math.clamp(relative_pos.X, -half_size.X, half_size.X);
		let y = math.clamp(relative_pos.Y, -half_size.Y, half_size.Y);

		// grid constraints
		if (this.gridUnit > 0) {
			x = MathUtil.floorToMultiple(x, 4);
			y = MathUtil.floorToMultiple(y, 4);
		}

		// return to egomoose's formula which makes me sense right now
		return surface_cf.mul(new CFrame(x, y, -model_size.Y / 2));
	}
}
