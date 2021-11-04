import { Controller, OnRender, OnStart } from "@flamework/core";
import BaseClientPlacement from "client/placement/base";
import { CameraController } from "./CameraController";
import { InputController } from "./InputController";
import { LotController } from "./LotController";

@Controller({})
export class PlacementController implements OnStart, OnRender {
	private currentPlacement?: BaseClientPlacement;

	public constructor(
		private inputController: InputController,
		private cameraController: CameraController,
		private lotController: LotController,
	) {}

	/** @hidden */
	public onRender() {
		this.currentPlacement?.onTick();
	}

	/** @hidden */
	public onStart() {
		this.lotController.onOwnedLot.Connect(() => {
			const ownerLot = this.lotController.getOwnerLot().unwrap();
			const params = new RaycastParams();
			params.FilterType = Enum.RaycastFilterType.Whitelist;
			params.FilterDescendantsInstances = [ownerLot.instance.PrimaryPart!];

			const placement = new BaseClientPlacement(ownerLot.instance.PrimaryPart!, params);
			const cube = new Instance("Model");
			const real_cube = new Instance("Part");
			real_cube.Size = new Vector3(4, 4, 4);
			real_cube.Anchored = true;
			cube.PrimaryPart = real_cube;
			placement.setCursor(cube);

			this.cameraController.getCamera().match(
				cam => (real_cube.Parent = cam),
				() => {},
			);

			this.inputController.toggleCharacterMovement(false);
			this.cameraController.runScriptableSession("Placement");
			this.currentPlacement = placement;
		});
	}
}
