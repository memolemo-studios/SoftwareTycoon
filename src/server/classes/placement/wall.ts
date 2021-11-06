import { ServerLot } from "server/components/game/ServerLot";
import WallPlacement from "shared/placement/wall";
import CFrameUtil from "shared/util/cframe";

export default class WallServerPlacement {
	private dummyPart: BasePart;
	public readonly placement: WallPlacement;

	public constructor(public readonly lot: ServerLot) {
		this.placement = new WallPlacement(this.lot.instance.Primary);

		// dummy part creation
		const dummy_part = new Instance("Part");
		dummy_part.Transparency = 1;
		dummy_part.CanCollide = false;
		dummy_part.Size = new Vector3(1, 12, 1);

		// dummy part is cursor-like part
		this.dummyPart = dummy_part;
		this.placement.setCursor(dummy_part);
	}

	// i made this code effortlessly lol, idk what to do
	public build(head: Vector3, tail: Vector3) {
		// getting the estimated cframe
		const head_cframe = this.placement.calculatePlacementCF(head, 0);
		const tail_cframe = this.placement.calculatePlacementCF(tail, 0);

		// let's build a wall!
		const [wall_cframe, wall_length] = CFrameUtil.makeLine(head_cframe.Position, tail_cframe.Position);
		const wall = new Instance("Part");
		wall.Anchored = true;
		wall.Size = new Vector3(1, 12, wall_length);
		wall.CFrame = wall_cframe;
		wall.Parent = this.lot.instance;
	}
}
