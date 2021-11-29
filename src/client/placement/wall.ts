import { Workspace } from "@rbxts/services";
import { OnPlacementStarted, Placement } from "client/controllers/placement/PlacementController";
import { $instance } from "rbxts-transformer-fs";
import { WallPlacement } from "shared/classes/placement/wall";
import { PlacementFlags } from "shared/flags";
import { CFrameUtil } from "shared/utils/cframe";
import { OptionUtil } from "shared/utils/option";
import { ClientBasePlacement, ClientPlacementState } from "./base";

declare global {
  interface ClientPlacements {
    WallPlacement: ClientWallPlacement;
  }
}

enum WallPlacementState {
  Head,
  Tail,
}

// this will prevent from unnecessary changes to the mesh
const DEFAULT_CURSOR = $instance<MeshPart>("assets/game/ReplicatedStorage/Assets/cursor/wall.rbxmx").Clone();

@Placement({
  name: "WallPlacement",
  gridSize: PlacementFlags.GridSize,
})
export class ClientWallPlacement extends ClientBasePlacement implements OnPlacementStarted {
  protected ghost!: BasePart;
  protected headPosition = new Vector3();
  protected wallState = WallPlacementState.Head;

  public constructor() {
    super("WallPlacement");
  }

  // @override
  public render(delta_time: number) {
    // do not render if it is not placing
    if (this.state !== ClientPlacementState.Placing) return;

    this.cursorSpring.update(delta_time);
    this.updateGhostTemp();
  }

  protected backToHead() {
    this.wallState = WallPlacementState.Head;
    this.headPosition = new Vector3();
    this.ghost.Transparency = 1;
  }

  protected fromTailToHead() {
    const tail_position = this.cursorSpring.getPosition();
    const distance = this.headPosition.sub(tail_position).Magnitude;

    this.backToHead();
    if (distance > 0) this.done();
  }

  protected fromHeadToTail() {
    // TODO: we're going to care about collision detect system later
    this.headPosition = this.cursorSpring.getPosition();
    this.ghost.Transparency = 0.9;
    this.wallState = WallPlacementState.Tail;
  }

  // @override
  protected onClick() {
    if (this.state !== ClientPlacementState.Placing) return;
    if (this.wallState === WallPlacementState.Head) {
      this.fromHeadToTail();
    }
  }

  /** Updating the ghost part */
  protected updateGhostTemp() {
    // construct a line cframe if it is in tail state
    if (this.wallState !== WallPlacementState.Tail) return;
    if (this.ghost === undefined) return;

    const [cframe, length] = CFrameUtil.makeLine(this.headPosition, this.cursorSpring.getPosition());
    this.ghost.CFrame = cframe;
    this.ghost.Size = new Vector3(1, 12, length);
  }

  // @override
  protected updatePosition() {
    // making sure this placement has cursor and followed the RaycastParams object
    const cursor_opt = this.getCursor();
    const raycast_opt = this.mouse.raycast(this.placement.raycastParams);

    const union_opt = OptionUtil.union(cursor_opt, raycast_opt);
    if (union_opt.isNone()) return;

    const [, result] = union_opt.unwrap();
    const cframe = this.placement.calculatePlacementCF(result.Position, this.rotation);
    this.cursorSpring.setPosition(cframe.Position);
  }

  protected onLeftClick() {
    if (this.state !== ClientPlacementState.Placing) return;
    if (this.wallState !== WallPlacementState.Tail) return;
    this.fromTailToHead();
  }

  /** @hidden */
  public onPlacementStarted() {
    // only create something if it is in idle state
    if (this.state !== ClientPlacementState.Idle) return;

    // wall rod as a default cursor
    const cursor = DEFAULT_CURSOR.Clone();
    cursor.Parent = Workspace.CurrentCamera;
    this.setCursor(cursor);

    // creating a wall ghost part
    const ghost = new Instance("Part");
    ghost.Anchored = true;
    ghost.CanCollide = false;
    ghost.Transparency = 0.9;
    ghost.BrickColor = new BrickColor("Light blue");
    ghost.Material = Enum.Material.Neon;
    ghost.Parent = Workspace.CurrentCamera;

    this.bin.add(cursor);
    this.bin.add(ghost);
    this.bin.add(this.mouse.leftUp.Connect(() => this.onLeftClick()));

    this.ghost = ghost;
  }

  // @override
  protected makePlacement(canvas: BasePart) {
    return new WallPlacement(canvas);
  }
}
