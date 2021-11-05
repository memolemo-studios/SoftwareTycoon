import Spring from "@rbxts/spring";
import CFrameUtil from "shared/util/cframe";

/**
 * This class helps to move the model using spring animations
 * with rotation as well.
 *
 * You can also turn off interpolation to avoid smooth animations.
 */
export default class ModelSpring {
	public readonly positionSpring = new Spring(new Vector3());
	public readonly rotationSpring = new Spring(new Vector3());

	private canInterpolate = false;

	/**
	 * Creates a new ModelSpring
	 *
	 * **Beware**: The `updateModel` method will not work if you don't have a valid
	 * model property with PrimaryPart property in it.
	 *
	 * It uses `SetPrimaryPartCFrame` method to do this.
	 * @param model Model with PrimaryPart required
	 */
	public constructor(public model?: Model) {}

	private isValidModel() {
		return (
			this.model !== undefined &&
			typeIs(this.model, "Instance") &&
			this.model.IsA("Model") &&
			this.model.PrimaryPart !== undefined
		);
	}

	/**
	 * This method can only be used for task scheduling events
	 * such as `RenderStepped` or `Heartbeat`
	 *
	 * It allows to update the model without needing to update the springs
	 * @param deltaTime
	 */
	public updateModel() {
		// because interpolation can be optional, we can only use getter methods
		const position = this.getPosition();
		const rotation = this.getRotation();

		// disallow if that model is not a real validated model
		if (!this.isValidModel()) return;

		// create CFrame stuff
		const final_cframe = CFrameUtil.fromPositionAndRotation(position, rotation);
		this.model!.SetPrimaryPartCFrame(final_cframe);
	}

	/**
	 * This method can only be used for task scheduling events
	 * such as `RenderStepped` or `Heartbeat`
	 *
	 * It allows to update the position and rotation springs and model altogether
	 * @param deltaTime Render delta time
	 */
	public update(deltaTime: number) {
		// update springs
		this.positionSpring.update(deltaTime);
		this.rotationSpring.update(deltaTime);

		// update the model as well
		this.updateModel();
	}

	/**
	 * Sets if it can be interpolated
	 * @param bool Boolean to enable/disable interpolation
	 */
	public setInterpolated(bool: boolean) {
		this.canInterpolate = bool;
	}

	/** Gets the current spring position (unless it can be interpolated) */
	public getPosition() {
		if (!this.canInterpolate) return this.positionSpring.goal;
		return this.positionSpring.position;
	}

	/**
	 * Sets the position (goal rather) to the current one based on the argument
	 * @param position New position to have transition
	 */
	public setPosition(position: Vector3) {
		this.positionSpring.goal = position;
	}

	/**
	 * Gets the current spring rotation (unless it can be interpolated)
	 */
	public getRotation() {
		if (!this.canInterpolate) return this.rotationSpring.goal;
		return this.rotationSpring.position;
	}

	/**
	 * Sets the rotation (goal rather) to the current one based on the argument
	 * @param rotation New rotation to have transition
	 */
	public setRotation(position: Vector3) {
		this.rotationSpring.goal = position;
	}
}
