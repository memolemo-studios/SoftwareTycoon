import {
  OnPlacementInstantiate,
  OnPlacementStarted,
  Placement,
} from "client/controllers/placement/PlacementController";
import { WallPlacement } from "shared/classes/placement/wall";
import { PlacementFlags } from "shared/flags";
import { ClientBasePlacement } from "./base";

enum WallPlacementState {
  Head,
  Tail,
}

@Placement({
  name: "WallPlacement",
  gridSize: PlacementFlags.GridSize,
})
export class ClientWallPlacement extends ClientBasePlacement implements OnPlacementInstantiate, OnPlacementStarted {
  public constructor() {
    super("WallPlacement");
  }

  /** @hidden */
  public onPlacementInstantiate(camera?: Camera) {}

  /** @hidden */
  public onPlacementStarted() {
    print("Working!");
  }

  // @override
  protected makePlacement(canvas: BasePart) {
    return new WallPlacement(canvas);
  }
}
