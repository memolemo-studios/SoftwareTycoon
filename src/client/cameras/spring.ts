import { Result } from "@rbxts/rust-classes";
import Spring from "@rbxts/spring";
import { CameraDebugConfig } from "shared/constants/camera";
import CFrameUtil from "shared/util/cframe";
import VectorUtil from "shared/util/vector";
import BaseScriptableCamera from "./base";

const { POSITION_DAMPER, POSITION_SPEED, ROTATION_DAMPER, ROTATION_SPEED } = CameraDebugConfig;

/** BaseScriptableCamera with smooth spring animations */
export default class SpringScriptableCamera extends BaseScriptableCamera {
	protected positionSpring: Spring<Vector3>;
	protected rotationSpring: Spring<Vector3>;

	public constructor(debugMode?: boolean) {
		super(debugMode);

		const position_spring = new Spring(super.getPosition());
		const rotation_spring = new Spring(super.getRotation());

		position_spring.dampingRatio = POSITION_DAMPER;
		position_spring.angularFrequency = POSITION_SPEED;

		rotation_spring.dampingRatio = ROTATION_DAMPER;
		rotation_spring.angularFrequency = ROTATION_SPEED;

		this.positionSpring = position_spring;
		this.rotationSpring = rotation_spring;
	}

	protected updateDebugAttributes() {
		return super.updateDebugAttributes().andWith<true>(() => {
			this.getCamera().map(cam => {
				cam.SetAttribute("POSITION_DAMPER", this.positionSpring.dampingRatio);
				cam.SetAttribute("POSITION_SPEED", this.positionSpring.angularFrequency);
				cam.SetAttribute("ROTATION_DAMPER", this.rotationSpring.dampingRatio);
				cam.SetAttribute("ROTATION_SPEED", this.rotationSpring.angularFrequency);
			});
			return Result.ok(true);
		});
	}

	protected onAttributeChanged(cam: Camera, changed: string) {
		super.onAttributeChanged(cam, changed);
		switch (changed) {
			case "POSITION_DAMPER":
				this.positionSpring.dampingRatio = cam.GetAttribute("POSITION_DAMPER") as number;
				break;
			case "POSITION_SPEED":
				this.positionSpring.angularFrequency = cam.GetAttribute("POSITION_SPEED") as number;
				break;
			case "ROTATION_DAMPER":
				this.rotationSpring.dampingRatio = cam.GetAttribute("ROTATION_DAMPER") as number;
				break;
			case "ROTATION_SPEED":
				this.rotationSpring.angularFrequency = cam.GetAttribute("ROTATION_SPEED") as number;
				break;
			default:
				break;
		}
	}

	protected _setPosition(position: Vector3) {
		super._setPosition(position);
		this.positionSpring.goal = position;
	}

	protected _setRotation(rotation: Vector3) {
		super._setRotation(rotation);
		this.rotationSpring.goal = rotation;
	}

	/**
	 * Gets the current position spring damper
	 * @returns Current spring damper
	 */
	public getRotationSpringSpeed() {
		return this.rotationSpring.angularFrequency;
	}

	/**
	 * Sets the current position spring damper
	 * @param damper Damper to change to
	 */
	public setRotationSpringSpeed(damper: number) {
		this.rotationSpring.angularFrequency = damper;
	}

	/**
	 * Gets the current position spring damper
	 * @returns Current spring damper
	 */
	public getRotationSpringDamper() {
		return this.rotationSpring.dampingRatio;
	}

	/**
	 * Sets the current position spring damper
	 * @param damper Damper to change to
	 */
	public setRotationSpringDamper(damper: number) {
		this.rotationSpring.dampingRatio = damper;
	}

	/**
	 * Gets the current position spring damper
	 * @returns Current spring damper
	 */
	public getPositionSpringSpeed() {
		return this.positionSpring.angularFrequency;
	}

	/**
	 * Sets the current position spring damper
	 * @param damper Damper to change to
	 */
	public setPositionSpringSpeed(damper: number) {
		this.positionSpring.angularFrequency = damper;
	}

	/**
	 * Gets the current position spring damper
	 * @returns Current spring damper
	 */
	public getPositionSpringDamper() {
		return this.positionSpring.dampingRatio;
	}

	/**
	 * Sets the current position spring damper
	 * @param damper Damper to change to
	 */
	public setPositionSpringDamper(damper: number) {
		this.positionSpring.dampingRatio = damper;
	}

	/**
	 * Gets the current spring position
	 * @returns Spring current position
	 */
	public getPosition() {
		return this.positionSpring.position;
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
		return this.rotationSpring.position;
	}

	/**
	 * Gets the raw target rotation rather than `getRotation` method
	 * which it returns the current spring rotation
	 * @returns Raw target rotation
	 */
	public getRawRotation() {
		return super.getRotation();
	}

	protected updateSpringCam(deltaTime: number) {
		// update both springs
		this.positionSpring.update(deltaTime);
		this.rotationSpring.update(deltaTime);

		// update the camera, goodie!
		this.getCamera().map(cam => {
			cam.CFrame = CFrameUtil.fromPositionAndRotation(
				this.positionSpring.position,
				VectorUtil.toRadians(this.rotationSpring.position),
			);
		});
	}

	/**
	 * Updates the camera with the render delta time
	 * @param deltaTime Render delta time
	 */
	public update(deltaTime: number) {
		this.updateSpringCam(deltaTime);
	}
}
