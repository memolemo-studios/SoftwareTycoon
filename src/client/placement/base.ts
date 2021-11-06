import { Bin } from "@rbxts/bin";
import Signal from "shared/classes/signal";
import { Workspace } from "@rbxts/services";
import Keyboard from "client/input/keyboard";
import Mouse from "client/input/mouse";
import ModelSpring from "shared/classes/modelSpring";
import BasePlacement from "shared/placement/base";

export enum ClientPlacementState {
	Idle,
	Paused,
	Placing,
	Cancelled,
	Done,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DestroyCallback<A extends any[] = any[]> = (done: boolean, ...args: A) => void;

// I tried to make a placement classes in composition type
export default abstract class ClientBasePlacement {
	/** Main bin (permanent objects use only) */
	protected bin = new Bin();

	/** Placement bin (temporary objects use only) */
	protected placementBin = new Bin();

	protected canPlace = true;
	protected keyboard: Keyboard;
	protected mouse: Mouse;
	protected modelSpring: ModelSpring;
	protected rotation = 0;
	protected state = ClientPlacementState.Idle;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected onDestroyConnections = new Array<DestroyCallback>();

	public readonly placement!: BasePlacement;

	// prettier-ignore
	public readonly onStateChanged = new Signal<(
		newState: ClientPlacementState,
		oldState: ClientPlacementState) => void
	>();

	public constructor(public canvas: BasePart) {
		// making classes
		this.keyboard = new Keyboard();
		this.mouse = new Mouse();
		this.modelSpring = new ModelSpring();
		this.placement = this.makePlacement(canvas);
		this.bin.add(this.placementBin);

		// cleanup stuff
		this.bin.add(this.keyboard);
		this.bin.add(this.mouse);
		this.bin.add(
			this.mouse.leftDown.Connect(() => {
				this.onClick();
			}),
		);
		this.bin.add(
			this.keyboard.keyDown.Connect(keycode => {
				if (keycode === Enum.KeyCode.R) this.rotate();
			}),
		);

		this.onInstantiate(Workspace.CurrentCamera);
	}

	// abstract functions
	protected abstract onInstantiate(camera?: Camera): void;
	protected abstract onStart(): void;
	protected abstract onPause(): void;

	protected abstract updateCollision(): void;
	protected abstract updatePosition(): void;
	protected abstract updateRotation(): void;

	/** Tries to rotate the object (you can override it if you like) */
	protected rotate() {
		this.rotation += math.pi / 2;
	}

	/** This method should only called for `MouseClick` events */
	protected onClick() {
		if (this.canPlace) this.done();
	}

	/**
	 * This method allows to toggle if it can be interpolated
	 * @param bool Boolean to toggle to change interpolation to
	 */
	public setCanInterpolated(bool: boolean) {
		this.modelSpring.setInterpolated(bool);
	}

	/**
	 * This method can only be used for task scheduling events.
	 *
	 * Unlike `update` method, this method should be used after
	 * `update` method.
	 *
	 * Otherwise, it will have some delay.
	 * @param deltaTime Render delta time
	 */
	public render(deltaTime: number) {
		this.modelSpring.update(deltaTime);
	}

	/**
	 * This method can only be used for task scheduling events
	 * such as `RenderStepped` or `Heartbeat`
	 *
	 * It allows to update the placement regardless of configurations.
	 * @param deltaTime Render delta time
	 */
	public update(deltaTime: number) {
		// do not update if it is not placing
		if (this.state !== ClientPlacementState.Placing) return;

		// update stuff
		this.updatePosition();
		this.updateRotation();
		this.updateCollision();
	}

	/**
	 * Binds a callback and calls whenever the placement class is being destroyed
	 * @param callback Callback to call when placement class is destroyed
	 */
	public bindToDestroy(callback: () => void) {
		// to do at the same time
		this.onDestroyConnections.push(callback);
	}

	/** BasePlacement constructor */
	protected abstract makePlacement(canvasPart: BasePart): BasePlacement;

	/** Useful method for changing state */
	protected changeState(newState: ClientPlacementState) {
		// checking for the same state, this will
		// avoid firing the signal twice
		const old_state = this.state;
		if (old_state === newState) return;

		this.state = newState;
		this.onStateChanged.Fire(newState, old_state);
	}

	/**
	 * Attempts to start BasePlacement class
	 * @returns It will return true if it is successfully started
	 */
	public start() {
		// making sure it is not started before
		if (this.state > ClientPlacementState.Paused) return false;

		// done!!!
		this.changeState(ClientPlacementState.Placing);
		this.onStart();

		return true;
	}

	/**
	 * Attempts to pause BasePlacement class
	 * @returns It will return true if it is successfully paused
	 */
	public pause() {
		// making sure it is not paused before
		if (this.state === ClientPlacementState.Paused) return false;

		// pause!
		this.changeState(ClientPlacementState.Paused);
		this.placementBin.destroy();
		this.onPause();

		return true;
	}

	/**
	 * This method will do a done state
	 * @returns It will return true if it is successfully done
	 */
	protected done() {
		if (this.state >= ClientPlacementState.Done) return false;
		this.changeState(ClientPlacementState.Done);
		this.destroy();
		return true;
	}

	/**
	 * Cancels placement, done!
	 *
	 * **BEWARE**: This will never start back after
	 * it is cancelled.
	 */
	public cancel() {
		this.changeState(ClientPlacementState.Cancelled);
		this.destroy();
	}

	protected destroyBindConnections(done: boolean) {
		for (const callback of this.onDestroyConnections) {
			callback(done);
		}
	}

	/** Destroys BasePlacement class */
	public destroy() {
		this.bin.destroy();
		this.destroyBindConnections(this.state === ClientPlacementState.Done);
		this.onDestroyConnections.clear();
	}

	/**
	 * Gets the current state of the placement class
	 * @returns Current state
	 */
	public getState() {
		return this.state;
	}

	/**
	 * Sets a new cursor for the placement.
	 *
	 * **NOTE**: Placement system don't work
	 * if it is not a valid cursor
	 * @param cursor Valid cursor argument
	 */
	public setCursor(cursor: Model | BasePart) {
		assert(cursor);
		this.placement.setCursor(cursor);

		// TODO: support for BasePart...
		if (classIs(cursor, "Model")) {
			this.modelSpring.model = cursor;
		}
	}

	/**
	 * Gets a cursor from the placement
	 * @returns Option with cursor (BasePart or Part)
	 */
	public getCursor() {
		return this.placement.getCursor();
	}
}
