import { Bin } from "@rbxts/bin";
import { Option } from "@rbxts/rust-classes";
import Keyboard from "client/input/keyboard";
import Mouse from "client/input/mouse";
import BasePlacement from "shared/classes/placement";
import Spring from "shared/classes/spring";
import CFrameUtil from "shared/util/cframe";
import OptionUtil from "shared/util/option";

/** BasePlacement but it is for the client */
export default class BaseClientPlacement extends BasePlacement {
	protected bin = new Bin();
	protected cursor?: Model;

	protected keyboard = new Keyboard();
	protected mouse = new Mouse();

	protected positionSpring = new Spring(new Vector3());
	protected rotationSpring = new Spring(0);

	protected rotation = 0;

	public constructor(
		canvas: BasePart,
		protected raycastParams?: RaycastParams,
		canvasSurface = Enum.NormalId.Top,
		gridUnit = 0,
	) {
		super(canvas, canvasSurface, gridUnit);

		this.positionSpring.Speed = 20;
		this.rotationSpring.Speed = 20;

		// cleanups
		this.bin.add(this.keyboard);
		this.bin.add(this.mouse);
	}

	private validateCursor() {
		return typeIs(this.cursor, "Instance") && this.cursor.IsA("Model") && this.cursor.PrimaryPart !== undefined;
	}

	public getCursor(): Option<Model> {
		// validating cursor
		if (!this.validateCursor()) {
			return Option.none();
		}
		return Option.some(this.cursor!);
	}

	public setCursor(cursor: Model) {
		this.cursor = cursor;
	}

	private render() {
		this.getCursor().match(
			cursor => {
				const final_cframe = CFrameUtil.fromPositionAndRotation(
					this.positionSpring.Position,
					new Vector3(0, this.rotationSpring.Position, 0),
				);
				cursor.SetPrimaryPartCFrame(final_cframe);
			},
			() => {},
		);
	}

	private updateRotation() {
		if (this.rotation !== this.rotationSpring.Target) {
			this.rotationSpring.Target = this.rotation;
		}
	}

	private updatePosition() {
		// prettier-ignore
		OptionUtil
			.combine(this.getCursor(), this.mouse.raycast(this.raycastParams))
			.map(([cursor, result]) => {
				const cframe = this.calculatePlacementCF(cursor, result.Position, this.rotation);
				this.positionSpring.Target = cframe.Position;
			});
	}

	/**
	 * Executes and updates the entire system
	 *
	 * **NOTE**: This can only be used for task scheduler events
	 */
	public onTick() {
		// update position and rotation
		this.updatePosition();
		this.updateRotation();

		// render
		this.render();
	}
}
