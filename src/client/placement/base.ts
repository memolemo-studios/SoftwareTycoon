import BasePlacement from "shared/classes/placement";

/** BasePlacement but it is for the client */
export default class BaseClientPlacement extends BasePlacement {
	public constructor(
		canvas: BasePart,
		raycastParams?: RaycastParams,
		canvasSurface = Enum.NormalId.Top,
		gridUnit = 0,
	) {
		super(canvas, canvasSurface, gridUnit);
	}
}
