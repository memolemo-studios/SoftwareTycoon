import { Bin } from "@rbxts/bin";
import Keyboard from "client/input/keyboard";
import Mouse from "client/input/mouse";
import ModelSpring from "shared/classes/modelSpring";
import BasePlacement from "shared/placement/base";
import MathUtil from "shared/util/math";
import OptionUtil from "shared/util/option";

const TAU = MathUtil.TAU;
const HALF_PI = math.pi / 2;

export default class ClientBasePlacement extends BasePlacement {
	protected bin = new Bin();
	protected modelSpring: ModelSpring;

	protected keyboard: Keyboard;
	protected mouse: Mouse;

	protected rotation = 0;
	protected canRotate = true;

	protected isStarted = false;

	public constructor(canvas: BasePart, public raycastParams?: RaycastParams) {
		super(canvas);
		this.keyboard = new Keyboard();
		this.mouse = new Mouse();
		this.modelSpring = new ModelSpring();
		this.setCanInterpolate(true);
		this.gridUnit = 4;

		this.bin.add(this.keyboard);
		this.bin.add(this.mouse);
	}

	private rotate() {
		this.rotation += HALF_PI;
	}

	/** Starts a ClientBasePlacement object (if it can) */
	public start() {
		if (this.isStarted) return;
		this.isStarted = true;

		// only enable rotation if it can be
		if (this.canRotate) {
			this.bin.add(
				this.keyboard.keyDown.Connect(() => {
					if (this.keyboard.isKeyDown(Enum.KeyCode.R)) {
						this.rotate();
					}
				}),
			);
		}
	}

	protected updateRotation() {
		if (this.rotation !== this.modelSpring.getRotation().Y) {
			this.modelSpring.setRotation(new Vector3(0, this.rotation, 0));
		}
	}

	protected updatePosition() {
		// prettier-ignore
		OptionUtil
			.combine(
				this.getCursor(),
				this.mouse.raycast(this.raycastParams)
			).map(([_, result]) => {
				const cframe = this.calculatePlacementCF(result.Position, math.rad(this.rotation));
				this.modelSpring.setPosition(cframe.Position);
			});
	}

	/**
	 * This method allows to toggle if it can be interpolated
	 * @param bool Boolean to toggle to change interpolation to
	 */
	public setCanInterpolate(bool: boolean) {
		this.modelSpring.setInterpolated(bool);
	}

	/**
	 * This method can only be used for task scheduling events
	 * such as `RenderStepped` or `Heartbeat`
	 *
	 * It allows to update the placement regardless of configurations.
	 * @param deltaTime Render delta time
	 */
	public update(deltaTime: number) {
		// do not update if it is not started
		if (!this.isStarted) return;

		// update stuff
		this.updatePosition();
		this.updateRotation();

		// update the model spring
		this.modelSpring.update(deltaTime);
	}

	// override
	public setCursor(cursor: Model) {
		this.modelSpring.model = cursor;
		this.cursor = cursor;
	}
}
