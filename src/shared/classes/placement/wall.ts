import { PlacementFlags } from "shared/flags";
import { MathUtil } from "shared/utils/math";
import { BasePlacement } from "./base";

export class WallPlacement extends BasePlacement {
  public gridUnit = PlacementFlags.GridSize;

  // @override
  protected calculateXYGrid(x: number, y: number) {
    const grid_unit = this.gridUnit;
    const final_x = MathUtil.roundToMultiple(x, grid_unit);
    const final_y = MathUtil.roundToMultiple(y, grid_unit);
    return [final_x, final_y] as const;
  }
}
