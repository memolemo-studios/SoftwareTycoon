import { Result } from "@rbxts/rust-classes";
import Keyboard from "client/input/keyboard";
import Mouse from "client/input/mouse";
import MovementController from "client/input/movement";
import CFrameUtil from "shared/util/cframe";
import VectorUtil from "shared/util/vector";
import SpringScriptableCamera from "./spring";

export default class PlacementScriptableCamera extends SpringScriptableCamera {
	protected movementController: MovementController;
	protected keyboard: Keyboard;
	protected mouse: Mouse;

	protected sensitivity = 0.5;
	protected moveSpeed = 10;
	protected rotateSpeed = 10;

	// 0 - not moving
	// 1 or -1 - moving
	protected walkChangeSpeedX = 0;
	protected walkChangeSpeedZ = 0;
	protected angleChangeSpeed = 0;

	public constructor(debugMode?: boolean) {
		super(debugMode);

		// creating new input classes
		this.movementController = new MovementController(this.sensitivity);
		this.mouse = new Mouse();
		this.keyboard = new Keyboard();

		// cleaning these bois
		this.bin.add(this.movementController);
		this.bin.add(this.mouse);
		this.bin.add(this.keyboard);
	}

	protected updateDebugAttributes() {
		return super.updateDebugAttributes().andWith<true>(() => {
			this.getCamera().map(cam => {
				cam.SetAttribute("SENSITIVITY", this.sensitivity);
				cam.SetAttribute("MOVE_SPEED", this.moveSpeed);
				cam.SetAttribute("ROTATION_VELOCITY", this.rotateSpeed);
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
				this.moveSpeed = cam.GetAttribute("MOVE_SPEED") as number;
				break;
			case "ROTATION_VELOCITY":
				this.rotateSpeed = cam.GetAttribute("ROTATION_VELOCITY") as number;
			default:
				break;
		}
	}

	protected updateRotateChange() {
		// TODO: find a way how to workaround with arrow keys
		if (
			this.keyboard.areAnyKeysDown(Enum.KeyCode.LeftBracket, Enum.KeyCode.RightBracket) &&
			!this.keyboard.areKeysDown(Enum.KeyCode.LeftBracket, Enum.KeyCode.RightBracket)
		) {
			if (this.keyboard.isKeyDown(Enum.KeyCode.LeftBracket)) {
				this.angleChangeSpeed = 1;
			}
			if (this.keyboard.isKeyDown(Enum.KeyCode.RightBracket)) {
				this.angleChangeSpeed = -1;
			}
		} else {
			this.angleChangeSpeed = 0;
		}
	}

	public update(deltaTime: number) {
		// movement controls
		const change_x = this.walkChangeSpeedX * this.moveSpeed * deltaTime;
		const change_z = this.walkChangeSpeedZ * this.moveSpeed * deltaTime;

		// update the rotation
		const initial_rotation = this.angleChangeSpeed * this.rotateSpeed * deltaTime;
		const final_rotation = new Vector3(
			this.currentRotation.X,
			this.currentRotation.Y + initial_rotation,
			this.currentRotation.Z,
		);

		// move based on the rotation
		const new_cframe = CFrameUtil.fromPositionAndRotation(
			this.currentPosition,
			VectorUtil.toRadians(new Vector3(0, final_rotation.Y, 0)),
		).mul(new CFrame(-change_x, 0, -change_z));

		this.setPosition(new_cframe.Position);
		this.setRotation(final_rotation);

		// update the spring camera
		this.updateSpringCam();
	}

	public start() {
		// movement input detection
		this.bin.add(
			this.movementController.onMove.Connect((x, z) => {
				this.walkChangeSpeedX = x;
				this.walkChangeSpeedZ = z;
			}),
		);

		this.bin.add(this.keyboard.keyDown.Connect(() => this.updateRotateChange()));
		this.bin.add(this.keyboard.keyUp.Connect(() => this.updateRotateChange()));

		// this will get an error possibly
		super.start();
	}
}
