import { Result } from "@rbxts/rust-classes";
import Spring from "shared/classes/spring";
import { CameraDebugConfig } from "shared/constants/camera";
import CFrameUtil from "shared/util/cframe";
import VectorUtil from "shared/util/vector";
import BaseScriptableCamera from "./base";

const { POSITION_DAMPER, POSITION_SPEED, ROTATION_DAMPER, ROTATION_SPEED } = CameraDebugConfig;

/** BaseScriptableCamera with smooth spring animations */
export default class SpringScriptableCamera extends BaseScriptableCamera {
	private positionSpring: Spring<Vector3>;
	private rotationSpring: Spring<Vector3>;

	public constructor(debugMode?: boolean) {
		super(debugMode);

		const position_spring = new Spring(super.getPosition());
		const rotation_spring = new Spring(super.getRotation());

		position_spring.Damper = POSITION_DAMPER;
		position_spring.Speed = POSITION_SPEED;

		rotation_spring.Damper = ROTATION_DAMPER;
		rotation_spring.Speed = ROTATION_SPEED;

		this.positionSpring = position_spring;
		this.rotationSpring = rotation_spring;
	}

	protected updateDebugAttributes() {
		return super.updateDebugAttributes().andWith<true>(() => {
			this.getCamera().map(cam => {
				cam.SetAttribute("POSITION_DAMPER", this.positionSpring.Damper);
				cam.SetAttribute("POSITION_SPEED", this.positionSpring.Speed);
				cam.SetAttribute("ROTATION_DAMPER", this.rotationSpring.Damper);
				cam.SetAttribute("ROTATION_SPEED", this.rotationSpring.Speed);
			});
			return Result.ok(true);
		});
	}

	protected onAttributeChanged(cam: Camera, changed: string) {
		super.onAttributeChanged(cam, changed);
		switch (changed) {
			case "POSITION_DAMPER":
				this.positionSpring.Damper = cam.GetAttribute("POSITION_DAMPER") as number;
				break;
			case "POSITION_SPEED":
				this.positionSpring.Speed = cam.GetAttribute("POSITION_SPEED") as number;
				break;
			case "ROTATION_DAMPER":
				this.rotationSpring.Damper = cam.GetAttribute("ROTATION_DAMPER") as number;
				break;
			case "ROTATION_SPEED":
				this.rotationSpring.Speed = cam.GetAttribute("ROTATION_SPEED") as number;
				break;
			default:
				break;
		}
	}

	protected _setPosition(position: Vector3) {
		super._setPosition(position);
		this.positionSpring.Target = position;
	}

	protected _setRotation(rotation: Vector3) {
		super._setRotation(rotation);
		this.rotationSpring.Target = rotation;
	}

	/**
	 * Gets the current spring position
	 * @returns Spring current position
	 */
	public getPosition() {
		return this.positionSpring.Position;
	}

	/**
	 * Gets the raw target position rather than `getPosition` method
	 * which it returns the current spring position
	 * @returns Raw target position
	 */
	public getRawPosition() {
		return super.getPosition();
	}

	/**
	 * Gets the current spring rotation
	 * @returns Spring current rotation
	 */
	public getRotation() {
		return this.rotationSpring.Position;
	}

	/**
	 * Gets the raw target rotation rather than `getRotation` method
	 * which it returns the current spring rotation
	 * @returns Raw target rotation
	 */
	public getRawRotation() {
		return super.getRotation();
	}

	/**
	 * Updates the camera with the render delta time
	 * @param deltaTime Render delta time
	 */
	public update(deltaTime: number) {
		this.getCamera().map(cam => {
			cam.CFrame = CFrameUtil.fromPositionAndRotation(
				this.positionSpring.Position,
				VectorUtil.toRadians(this.rotationSpring.Position),
			);
		});
	}
}
