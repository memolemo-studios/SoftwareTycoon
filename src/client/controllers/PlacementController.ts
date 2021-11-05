import { Controller, OnRender, OnStart } from "@flamework/core";
import Keyboard from "client/input/keyboard";
import ClientBasePlacement from "client/placement/base";
import { CameraController } from "./CameraController";
import { InputController } from "./InputController";
import { LotController } from "./LotController";

@Controller({})
export class PlacementController implements OnStart, OnRender {
	private placement?: ClientBasePlacement;

	public constructor(
		private inputController: InputController,
		private cameraController: CameraController,
		private lotController: LotController,
	) {}

	/** @hidden */
	public onRender(deltaTime: number) {
		this.placement?.update(deltaTime);
	}

	public startPlacement() {
		const ownerLot = this.lotController.getOwnerLot().unwrap();
		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Whitelist;
		params.FilterDescendantsInstances = [ownerLot.instance.PrimaryPart!];

		const placement = new ClientBasePlacement(ownerLot.instance.Primary!, params);
		const cube = new Instance("Model");
		const real_cube = new Instance("Part");
		real_cube.Size = new Vector3(4, 4, 4);
		real_cube.Anchored = true;
		real_cube.Parent = cube;
		cube.PrimaryPart = real_cube;

		placement.setCursor(cube);
		this.cameraController.getCamera().match(
			cam => (cube.Parent = cam),
			() => {},
		);

		this.inputController.toggleCharacterMovement(false);
		this.cameraController.runScriptableSession("Placement");
		this.placement = placement;
		placement.start();
	}

	/** @hidden */
	public onStart() {
		const keyboard = new Keyboard();
		keyboard.keyUp.Connect(code => {
			if (code !== Enum.KeyCode.P) return;
			keyboard.destroy();
		});
	}
}
