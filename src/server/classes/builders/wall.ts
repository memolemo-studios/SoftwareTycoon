import { Workspace } from "@rbxts/services";
import { $instance } from "rbxts-transformer-fs";
import { Lot } from "server/components/lot";
import { WallPlacement } from "shared/classes/placement/wall";
import { CFrameUtil } from "shared/utils/cframe";

const fake_cursor = $instance<MeshPart>("assets/game/ReplicatedStorage/Assets/cursor/wall.rbxmx");

export class WallBuilder {
  private placement: WallPlacement;

  public constructor(private readonly lot: Lot) {
    this.placement = new WallPlacement(this.lot.instance.Canvas);
    this.placement.setCursor(fake_cursor);
  }

  public buildWall(head: Vector3, tail: Vector3) {
    head = this.placement.calculatePlacementCF(head, 0).Position;
    tail = this.placement.calculatePlacementCF(tail, 0).Position;

    // attempting to create a wall
    const wall = new Instance("Part");
    wall.Anchored = true;

    const [line_cframe, length] = CFrameUtil.makeLine(head, tail);
    wall.CFrame = line_cframe;
    wall.Size = new Vector3(1, 12, length);
    wall.Parent = Workspace;
  }
}
