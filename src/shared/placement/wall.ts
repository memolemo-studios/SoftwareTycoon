import { PLACEMENT_CONFIG } from "shared/constants/placement";
import MathUtil from "shared/util/math";
import BasePlacement from "./base";

export default class WallPlacement extends BasePlacement {
	public gridUnit = PLACEMENT_CONFIG.GRID_SIZE;

	// override
	protected calculateXYGrid(x: number, y: number) {
		const grid_unit = this.gridUnit;
		const final_x = MathUtil.floorToMultiple(x, grid_unit);
		const final_y = MathUtil.floorToMultiple(y, grid_unit);
		return [final_x, final_y] as const;
	}
}
