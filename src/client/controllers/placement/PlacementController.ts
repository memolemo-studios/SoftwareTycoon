import { Controller, Flamework, OnInit, OnRender, OnStart, Reflect } from "@flamework/core";
import { Constructor } from "@flamework/core/out/types";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Keyboard } from "client/input/keyboard";
import { ClientBasePlacement } from "client/placement/base";
import { FlameworkUtil } from "shared/utils/flamework";
import { DecoratorMetadata } from "types/flamework";
import { LotController } from "../game/LotController";
import { CameraWorkerController } from "../io/CameraWorkerController";

/** Hook into the OnPlacementInstantiate event */
export interface OnPlacementInstantiate {
  /**
   * This function will be called whenever the placement is being instantiated.
   *
   * This should only used prepare something before starting.
   */
  onPlacementInstantiate(camera?: Camera): void;
}

/** Hook into the OnPlacementPaused event */
export interface OnPlacementPaused {
  /**
   * This function will be called whenever the placement is being paused.
   *
   * This should only used when the placement is paused.
   */
  onPlacementPaused(): void;
}

/** Hook into the OnPlacementStarted event */
export interface OnPlacementStarted {
  /**
   * This function will be called whenever the placement is now
   * being started.
   *
   * This should only used to setup the placement and preparation.
   */
  onPlacementStarted(): void;
}

/** Configuration for placement class */
export interface PlacementConfig {
  /** Name of the placement class */
  name: string;

  /** Grid size */
  gridSize?: number;

  /** Face of the canvas must facing */
  surface?: Enum.NormalId;

  /** Uses other canvas instead of lot as default */
  useOtherCanvas?: boolean;
}

/** Register a class as a Placement */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function Placement(cfg: PlacementConfig): any;

/** Placement registered info */
export interface PlacementInfo {
  config: PlacementConfig;
  ctor: Constructor<ClientBasePlacement>;
  flameworkId: string;
  hooks: {
    onInstantiate: boolean;
    onPaused: boolean;
    onStarted: boolean;
  };
}

const decorator_id = `${FlameworkUtil.DECORATOR_PREFIX}${Flamework.id<typeof Placement>()}`;

@Controller({})
export class PlacementController implements OnInit, OnStart, OnRender {
  private logger = Log.ForContext(PlacementController);
  private registeredPlacements = new Map<string, PlacementInfo>();
  private placement?: ClientBasePlacement;

  public constructor(private lotController: LotController, private cameraWorkerController: CameraWorkerController) {}

  /** @hidden */
  public onRender(delta_time: number) {
    if (this.placement) {
      this.placement.update(delta_time);
      this.placement.render(delta_time);
    }
  }

  /**
   * Starts a new placement with a name.
   *
   * **NOTE**: It will ignore if that placement class constructor
   * does not exists in the collection
   * @param name Any placement name
   */
  public startPlacement(name: string, canvas?: BasePart): Option<ClientBasePlacement> {
    this.logger.Debug("Attempting to start placement ({Name})", name);

    // making sure it is not in session yet
    if (this.placement) {
      this.logger.Error("Failed to start placement ({Name}) because it is already in session.", name);
      return Option.none();
    }

    // verifying placement class
    const info = this.registeredPlacements.get(name);
    if (info === undefined) {
      this.logger.Error("Failed to start placement ({Name}) because it does not exists.", name);
      return Option.none();
    }

    // if we need to get a default lot canvas because of 'useOtherCanvas' property
    let current_canvas: BasePart | undefined;
    if ((info.config.useOtherCanvas ?? true) === false) {
      current_canvas = canvas;
    } else {
      this.lotController.getOwnerLot().map(lot => {
        assert(lot.instance.PrimaryPart, `Expected 'PrimaryPart' in lot ${lot.attributes.ComponentId!}`);
        current_canvas = lot.instance.PrimaryPart!;
        return true;
      });
    }

    // if there's no any canvas left, then nevermind!
    if (current_canvas === undefined) {
      this.logger.Error("Failed to start placement ({Name}) because it has no avaliable canvas", name);
      return Option.none();
    }

    // create a new class yay!
    const placement = Flamework.createDependency(info.ctor) as ClientBasePlacement;
    placement.setup();
    placement.setCanvas(current_canvas);
    this.placement = placement;

    return Option.some(placement);
  }

  /**
   * Gets the current information of selected placement
   * @param name Valid placement name
   */
  public getPlacementInfo(name: string) {
    return Option.wrap(this.registeredPlacements.get(name));
  }

  /** @hidden */
  public onInit() {
    // registering all of the placement classes
    for (const [ctor, id] of Reflect.objToId) {
      const config = Reflect.getOwnMetadata<DecoratorMetadata<[PlacementConfig]>>(ctor, decorator_id)?.arguments[0];
      if (config === undefined) continue;

      // checking for duplication
      if (this.registeredPlacements.has(id)) {
        this.logger.Fatal("Duplicated placement name: {AppName}! {Conflict} class will be ignored", config.name);
        continue;
      }

      // spaghetti code
      let have_instantiate_hook = false;
      let have_started_hook = false;
      let have_paused_hook = false;

      if (Flamework.implements<OnPlacementPaused>(ctor)) {
        have_paused_hook = true;
      }

      if (Flamework.implements<OnPlacementInstantiate>(ctor)) {
        have_instantiate_hook = true;
      }

      if (Flamework.implements<OnPlacementStarted>(ctor)) {
        have_started_hook = true;
      }

      // setting up it
      this.registeredPlacements.set(config.name, {
        flameworkId: id,
        ctor: ctor as unknown as Constructor<ClientBasePlacement>,
        config,
        hooks: {
          onInstantiate: have_instantiate_hook,
          onStarted: have_started_hook,
          onPaused: have_paused_hook,
        },
      });
    }
  }

  /** @hidden */
  public onStart() {
    const keyboard = new Keyboard();
    keyboard.keyUp.Connect(code => {
      if (code !== Enum.KeyCode.P) return;
      keyboard.destroy();
      this.cameraWorkerController.startWorker("PlacementCameraWorker");
      // const placement = this.startPlacement("WallPlacement").expect("failed to create one!");
      // placement.bindToDone(() => {
      //   print("Done!");
      // });
    });
  }
}
