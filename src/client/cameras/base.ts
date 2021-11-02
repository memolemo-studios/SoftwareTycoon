import { Dependency } from "@flamework/core";
import { Bin } from "@rbxts/bin";
import { Result } from "@rbxts/rust-classes";
import { CameraController } from "client/controllers/CameraController";
import { CameraDebugConfig } from "shared/constants/camera";
import CFrameUtil from "shared/util/cframe";
import VectorUtil from "shared/util/vector";

const { POSITION, ROTATION } = CameraDebugConfig;
let camera_controller: CameraController;

/**
 * BaseScriptableCamera is a class where it is responsible
 * for mainpulating camera and do something with it.
 */
export default class BaseScriptableCamera {
	protected bin = new Bin();

	protected currentPosition = POSITION;
	protected currentRotation = ROTATION;

	/**
	 * Creates a new BaseScriptableCamera.
	 *
	 * **NOTE**: This will instantly stop the previous scriptable
	 * camera from CameraController if it is in session.
	 *
	 * If you debug mode is enabled, then it will create a new
	 * attributes storage
	 *
	 * @param debug_mode Debugging mode (attributes)
	 */
	public constructor(private debugMode = false) {
		// load camera controller upon instantiating
		if (camera_controller === undefined) {
			camera_controller = Dependency<CameraController>();
		}
	}

	protected getCamera() {
		return camera_controller.getCamera();
	}

	protected onAttributeChanged(cam: Camera, changed: string) {
		switch (changed) {
			case "POSITION":
				this.setPosition(cam.GetAttribute("POSITION") as Vector3);
				break;
			case "ROTATION":
				this.setRotation(cam.GetAttribute("ROTATION") as Vector3);
				break;
			default:
				break;
		}
	}

	protected listenDebugAttributes() {
		// only truly listen if it is in debug mode
		if (!this.debugMode) return;

		// listener :D
		this.getCamera().map(cam =>
			this.bin.add(cam.AttributeChanged.Connect(changed => this.onAttributeChanged(cam, changed))),
		);
	}

	protected updateDebugAttributes(): Result<true, false> {
		// only truly update if it is in debug mode
		if (!this.debugMode) return Result.err(false);

		// update attributes
		this.getCamera().map(cam => {
			cam.SetAttribute("POSITION", this.currentPosition);
			cam.SetAttribute("ROTATION", this.currentRotation);
		});

		return Result.ok(true);
	}

	/**
	 * Updates the camera with the render delta time
	 * @param deltaTime Render delta time
	 */
	public update(deltaTime: number) {
		this.getCamera().map(cam => {
			cam.CFrame = CFrameUtil.fromPositionAndRotation(
				this.currentPosition,
				VectorUtil.toRadians(this.currentRotation),
			);
		});
	}

	/** Gets the current position */
	public getPosition() {
		return this.currentPosition;
	}

	/** Gets the current rotation */
	public getRotation() {
		return this.currentRotation;
	}

	/** Internal `setPosition` method */
	protected _setPosition(position: Vector3) {
		this.currentPosition = position;
	}

	/** Internal `setRotation` method */
	protected _setRotation(rotation: Vector3) {
		this.currentRotation = rotation;
	}

	/**
	 * Sets the position
	 * @param position Position to change to
	 */
	public setPosition(position: Vector3) {
		this._setPosition(position);
		this.updateDebugAttributes();
	}

	/**
	 * Sets the rotation
	 * @param rotation Rotation to change to
	 */
	public setRotation(rotation: Vector3) {
		print(this.currentRotation, rotation);
		this._setRotation(rotation);
		print(this.currentRotation);
		this.updateDebugAttributes();
		print(this.currentRotation);
	}

	/**
	 * Starts the scriptable camera
	 */
	public start() {
		if (this.debugMode) {
			this.updateDebugAttributes();
			this.listenDebugAttributes();
		}
	}

	/**
	 * Destroys the camera
	 *
	 * **NOTE**: This will not going to back to normal unless
	 * it is resetted from the CameraController
	 */
	public destroy() {
		this.bin.destroy();
	}
}
