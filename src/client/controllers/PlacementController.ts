import { Controller, OnRender, OnStart } from "@flamework/core";
import { Option } from "@rbxts/rust-classes";
import Keyboard from "client/input/keyboard";
import ClientBasePlacement from "client/placement/base";
import WallPlacement from "client/placement/wall";
import { CameraController } from "./CameraController";
import { InputController } from "./InputController";
import { LotController } from "./LotController";

const PlacementOptions = {
	Wall: WallPlacement,
};

// convert this guy to type
type PlacementOptions = typeof PlacementOptions;

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

	/**
	 * Starts a new placement with configured type.
	 *
	 * **NOTE**: It will ignore if that placement class constructor
	 * does not exists in the collection
	 * @param kind Any placement kind provided with types
	 */
	public startPlacement<T extends keyof PlacementOptions>(kind: T): Option<PlacementOptions[T]> {
		// make sure it is not in session yet
		if (this.placement) return Option.none();

		// verifying if that kind of placement does exists
		if (PlacementOptions[kind] === undefined) return Option.none();

		// load it!
		return this.lotController.getOwnerLot().map(lot => {
			// instantiate it
			const placement = new PlacementOptions[kind](lot.instance.Primary);
			this.placement = placement;

			// initialize it
			this.initializePlacementClass(placement);

			// start now!
			placement.start();
			return placement as unknown as PlacementOptions[T];
		});
	}

	/**
	 * Initializes every placement class in a single method
	 * @param placement Any placement class would work
	 */
	public initializePlacementClass(placement: ClientBasePlacement) {
		// create game provided raycastparams
		const params = new RaycastParams();
		params.FilterType = Enum.RaycastFilterType.Whitelist;

		// only use owner's lot as of now
		this.lotController.getOwnerLot().match(
			lot => (params.FilterDescendantsInstances = [lot.instance.FilteredArea!]),
			() => {},
		);

		placement.raycastParams = params;

		// configurations
		this.inputController.toggleCharacterMovement(false);
		this.cameraController.runScriptableSession("Placement");
	}

	/** @hidden */
	public onStart() {
		const keyboard = new Keyboard();
		keyboard.keyUp.Connect(code => {
			if (code !== Enum.KeyCode.P) return;
			keyboard.destroy();
			this.startPlacement("Wall");
		});
	}
}
