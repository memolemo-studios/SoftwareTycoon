import { $instance } from "rbxts-transformer-fs";
import WallPlacement from "shared/placement/wall";
import CFrameUtil from "shared/util/cframe";
import OptionUtil from "shared/util/option";
import ClientBasePlacement, { ClientPlacementState, DestroyCallback } from "./base";

export enum WallPlacementState {
	Head = "Head",
	Tail = "Tail",
}

const WALL_ROD = $instance<Model>("assets/game/placement/WallRod.rbxmx");

export default class ClientWallPlacement extends ClientBasePlacement {
	protected wallState = WallPlacementState.Head;
	protected wallTemp!: Part;
	protected onDestroyConnections = new Array<DestroyCallback<[Vector3, Vector3]>>();
	protected headPosition = new Vector3();

	// override
	protected onInstantiate(camera?: Camera) {
		// wall rod as a default cursor
		const new_wall_rod = WALL_ROD.Clone();
		new_wall_rod.Parent = camera;

		this.setCursor(new_wall_rod);

		// create a new wall temp part
		const wall_temp = new Instance("Part");
		wall_temp.Anchored = true;
		wall_temp.CanCollide = false;
		wall_temp.Transparency = 0.9;
		wall_temp.BrickColor = new BrickColor("Light blue");
		wall_temp.Material = Enum.Material.Neon;
		wall_temp.Parent = camera;

		this.bin.add(wall_temp);
		this.bin.add(new_wall_rod);

		this.wallTemp = wall_temp;
	}

	// tail -> head
	protected backToHead() {
		this.wallState = WallPlacementState.Head;
		this.headPosition = new Vector3();
		this.wallTemp.Transparency = 1;
	}

	// head -> tail
	protected fromHead() {
		// we're going to care about collision detect system later
		this.headPosition = this.modelSpring.getPosition();
		this.wallTemp.Transparency = 0.9;
		this.wallState = WallPlacementState.Tail;
	}

	// tail -> head
	protected fromTail() {
		const tail_position = this.modelSpring.getPosition();
		const distance = this.headPosition.sub(tail_position).Magnitude;

		this.backToHead();
		if (distance > 0) {
			this.done();
		}
	}

	// override
	public render(deltaTime: number) {
		this.modelSpring.update(deltaTime);
		this.updateGhostTemp();
	}

	// override
	protected onClick() {
		if (this.wallState === WallPlacementState.Head) {
			return this.fromHead();
		}
	}

	protected updateGhostTemp() {
		// construct a line cframe if it is in tail state
		if (this.wallState === WallPlacementState.Tail) {
			const [line_cf, line_size] = CFrameUtil.makeLine(this.headPosition, this.modelSpring.getPosition());
			if (this.wallTemp) {
				this.wallTemp.CFrame = line_cf;
				this.wallTemp.Size = new Vector3(1, 12, line_size);
			}
		}
	}

	// override
	public bindToDestroy(callback: DestroyCallback) {
		this.onDestroyConnections.push(callback);
	}

	protected onClickLeftUp() {
		if (this.state !== ClientPlacementState.Placing) return;
		if (this.wallState !== WallPlacementState.Tail) return;
		this.fromTail();
	}

	// override
	protected onPause() {}

	// override
	protected onStart() {
		this.placementBin.add(this.mouse.leftDown.Connect(() => this.onClick()));
		this.placementBin.add(this.mouse.leftUp.Connect(() => this.onClickLeftUp()));
	}

	// override
	protected updateCollision() {}

	// override
	protected updatePosition() {
		// prettier-ignore
		OptionUtil
			.combine(
				this.getCursor(),
				this.mouse.raycast(this.placement.raycastParams
			))
			.map(([_, result]) => {
				const cframe = this.placement.calculatePlacementCF(result.Position, this.rotation);
				this.modelSpring.setPosition(cframe.Position);
			});
	}

	// override
	protected destroyBindConnections(done: boolean) {
		// do not call if it is not successfully placed...
		if (this.wallState !== WallPlacementState.Tail && this.state !== ClientPlacementState.Done) return;

		// calling in each other
		const head_position = this.headPosition;
		const tail_position = this.modelSpring.getPosition();
		for (const callback of this.onDestroyConnections) {
			callback(done, head_position, tail_position);
		}
	}

	// override
	protected updateRotation() {
		if (this.rotation !== this.modelSpring.getRotation().Y) {
			this.modelSpring.setRotation(new Vector3(0, this.rotation, 0));
		}
	}

	protected makePlacement(canvas: BasePart) {
		return new WallPlacement(canvas);
	}
}
