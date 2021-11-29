import { Dependency } from "@flamework/core";
import { Bin } from "@rbxts/bin";
import Log, { Logger } from "@rbxts/log";
import { Workspace } from "@rbxts/services";
import Signal from "@rbxts/signal";
import {
  OnPlacementInstantiate,
  OnPlacementPaused,
  OnPlacementStarted,
  PlacementController,
  PlacementInfo,
} from "client/controllers/placement/PlacementController";
import { Keyboard } from "client/input/keyboard";
import { Mouse } from "client/input/mouse";
import { CursorSpring } from "shared/classes/instance/cursorSpring";
import { BasePlacement } from "shared/classes/placement/base";

let placement_controller: PlacementController;

function reload_flamework_dependencies() {
  if (placement_controller === undefined) {
    placement_controller = Dependency<PlacementController>();
  }
}

/** Client placement states */
export enum ClientPlacementState {
  Idle,
  Paused,
  Placing,
  Cancelled,
  Done,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlacementDoneCallback<A extends any[] = any[]> = (...args: A) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ClientBasePlacement<T extends unknown[] = []> {
  protected bin = new Bin();
  protected canPlace = true;
  protected canvas!: BasePart;
  protected cursor!: BasePart | Model;
  protected cursorSpring!: CursorSpring;
  protected info!: PlacementInfo;
  protected keyboard!: Keyboard;
  protected logger: Logger;
  protected name: string;
  protected mouse!: Mouse;
  protected placement!: BasePlacement;
  protected rotation = 0;
  protected sessionBin = new Bin();
  protected state = ClientPlacementState.Idle;

  private onDoneConnections = new Array<PlacementDoneCallback<T>>();

  // prettier-ignore
  public readonly onStateChanged = new Signal<(
		newState: ClientPlacementState,
		oldState: ClientPlacementState) => void
	>();

  public constructor(class_name = "ClientBasePlacement") {
    this.name = class_name;
    this.logger = Log.ForContext(this);
  }

  /**
   * Setting up the entire class
   * @hidden
   */
  public setup() {
    // reload something
    reload_flamework_dependencies();

    const info = placement_controller
      .getPlacementInfo(this.name)
      .expect(`${this.name} does not exists! Have you checked twice about the name parameter?`);

    // making classes
    this.info = info;

    // fire OnPlacementInstantiate
    if (info.hooks.onInstantiate) {
      (this as unknown as OnPlacementInstantiate).onPlacementInstantiate(Workspace.CurrentCamera);
    }
  }

  /** Required for `@rbxts/log` */
  public toString() {
    return this.name;
  }

  /** BasePlacement constructor */
  protected makePlacement(canvas: BasePart): BasePlacement {
    throw "Please override this method or not use this at all";
  }

  /** Useful method for changing state */
  protected changeState(newState: ClientPlacementState) {
    // checking for the same state, this will avoid firing the signal twice
    const old_state = this.state;
    if (old_state === newState) return;

    this.state = newState;
    this.onStateChanged.Fire(newState, old_state);
  }

  /** Tries to rotate the object (you can override it if you like) */
  protected rotate() {
    this.rotation += math.pi / 2;
  }

  /** This method should only called for `MouseClick` events */
  protected onClick() {
    throw "Please override onClick method!";
  }

  protected updatePosition() {}
  protected updateRotation() {}
  protected updateCollision() {}

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
    // do not render if it is not placing
    if (this.state !== ClientPlacementState.Placing) return;
    this.cursorSpring.update(deltaTime);
  }

  /** Sets the RaycastParams configuration */
  public setRaycastParams(params: RaycastParams) {
    this.placement.raycastParams = params;
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
   * Binds a callback and calls whenever the placement class is done
   * @param callback Callback to call when placement class is done
   */
  public bindToDone(callback: PlacementDoneCallback<T>) {
    // to do at the same time
    this.onDoneConnections.push(callback);
  }

  /**
   * Attempts to start BasePlacement class
   * @returns It will return true if it is successfully started
   */
  public start() {
    // making sure it is not started before
    if (this.state > ClientPlacementState.Paused) return false;

    // only create stuff if it is in idle
    if (this.state === ClientPlacementState.Idle) {
      // creating new classes
      this.keyboard = new Keyboard();
      this.mouse = new Mouse();
      this.cursorSpring = new CursorSpring();

      // cleanup stuff
      this.bin.add(this.sessionBin);
      this.bin.add(this.keyboard);
      this.bin.add(this.mouse);
      this.bin.add(() => this.cursorSpring.cleanup());

      this.bin.add(
        this.mouse.leftDown.Connect(() => {
          this.onClick();
        }),
      );

      this.bin.add(
        this.keyboard.keyDown.Connect(() => {
          if (this.keyboard.isKeyDown(Enum.KeyCode.R)) {
            this.rotate();
          }
        }),
      );
    }

    // making sure abstract members must be prepared
    if (this.canvas === undefined || this.placement === undefined || this.canvas === undefined) {
      this.logger.Error("Failed to start because canvas, canvas or placement member is not defined!");
    }

    // done!!!
    if (this.info.hooks.onStarted === true) {
      (this as unknown as OnPlacementStarted).onPlacementStarted();
    }
    this.changeState(ClientPlacementState.Placing);
    this.logger.Debug("Starting placement");

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
    this.sessionBin.destroy();

    // hook
    this.logger.Debug("Pausing placement");
    if (this.info.hooks.onPaused === true) {
      (this as unknown as OnPlacementPaused).onPlacementPaused();
    }

    return true;
  }

  /**
   * Gets the current state of the placement class
   * @returns Current state
   */
  public getState() {
    return this.state;
  }

  /**
   * This method will do a done state
   * @returns It will return true if it is successfully done
   */
  protected done(...args: T) {
    if (this.state >= ClientPlacementState.Done) return false;

    // calling on done connections
    for (const callback of this.onDoneConnections) {
      callback(...args);
    }

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
    if (this.state >= ClientPlacementState.Cancelled) return;
    this.changeState(ClientPlacementState.Cancelled);
    this.destroy();
  }

  /** Destroys BasePlacement class */
  public destroy() {
    this.bin.destroy();
    this.onDoneConnections.clear();
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
    this.cursorSpring.setCursor(cursor);

    // advantage of that feature in Lua
    const position_spring = this.cursorSpring.positionSpring;
    position_spring.angularFrequency = 10;
    position_spring.dampingRatio = 1;

    const rotation_spring = this.cursorSpring.rotationSpring;
    rotation_spring.angularFrequency = 10;
    rotation_spring.dampingRatio = 1;

    this.setInterpolated(true);
  }

  /**
   * Gets a cursor from the placement
   * @returns Option with cursor (BasePart or Part)
   */
  public getCursor() {
    return this.placement.getCursor();
  }

  /** Sets the interpolation */
  public setInterpolated(bool: boolean) {
    this.cursorSpring.setInterpolated(bool);
  }

  /**
   * Sets the current canvas
   * @hidden
   */
  public setCanvas(new_canvas: BasePart) {
    this.canvas = new_canvas;
    if (this.placement) {
      this.placement.canvas = new_canvas;
    } else {
      this.placement = this.makePlacement(new_canvas);
      this.placement.targetSurface = this.info.config.surface ?? Enum.NormalId.Top;
      this.placement.gridUnit = this.info.config.gridSize ?? 0;
    }
  }
}
