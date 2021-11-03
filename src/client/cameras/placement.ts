import { Result } from "@rbxts/rust-classes";
import Mouse from "client/input/mouse";
import MovementController from "client/input/movement";
import SpringScriptableCamera from "./spring";

export default class PlacementScriptableCamera extends SpringScriptableCamera {
	protected movementController: MovementController;
	protected mouse: Mouse;

	protected sensitivity = 0.5;
	protected moveSpeed = 10;

	// 0 - not moving
	// 1 - moving
	protected walkChangeSpeedX = 0;
	protected walkChangeSpeedY = 0;
	protected rotateChangeSpeed = 0;

	public constructor(debugMode?: boolean) {
		super(debugMode);

		// creating new input classes
		this.movementController = new MovementController(this.sensitivity);
		this.mouse = new Mouse();

		// cleaning these bois
		this.bin.add(this.movementController);
		this.bin.add(this.mouse);
	}

	protected updateDebugAttributes() {
		return super.updateDebugAttributes().andWith<true>(() => {
			this.getCamera().map(cam => {
				cam.SetAttribute("SENSITIVITY", this.sensitivity);
				cam.SetAttribute("MOVE_SPEED", this.moveSpeed);
			});
			return Result.ok(true);
		});
	}

	protected onAttributeChanged(cam: Camera, changed: string) {
		super.onAttributeChanged(cam, changed);
		switch (changed) {
			case "SENSITIVITY":
				this.sensitivity = cam.GetAttribute("SENSITIVITY") as number;
				break;
			case "MOVE_SPEED":
				this.moveSpeed = cam.GetAttribute("MOVE_SPEEd") as number;
				break;
			default:
				break;
		}
	}

	public start() {
		// this will get an error possibly
		super.start();
	}
}
