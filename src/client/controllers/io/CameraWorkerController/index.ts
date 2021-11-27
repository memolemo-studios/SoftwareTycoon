import { Controller, Flamework, OnInit, OnRender, Reflect } from "@flamework/core";
import { Constructor } from "@flamework/core/out/types";
import Log from "@rbxts/log";
import { Result } from "@rbxts/rust-classes";
import { BaseCameraWorker } from "client/cameras/base";
import { FlameworkUtil } from "shared/utils/flamework";
import { DecoratorMetadata } from "types/flamework";
import {
  CameraWorker,
  CameraWorkerConfig,
  OnCameraWorkerAttributeChanged,
  OnCameraWorkerInit,
  OnCameraWorkerRender,
  OnCameraWorkerStart,
} from "./decorator";

interface WorkerInfo {
  ctor: Constructor<BaseCameraWorker>;
  worker: BaseCameraWorker;
  flameworkId: string;
}

const worker_decorator_id = `${FlameworkUtil.DECORATOR_PREFIX}${Flamework.id<typeof CameraWorker>()}`;

@Controller({})
export class CameraWorkerController implements OnInit, OnRender {
  private logger = Log.ForContext(CameraWorkerController);
  private workers = new Map<string, WorkerInfo>();
  private currentWorker?: BaseCameraWorker;

  /** @hidden */
  public onRender(delta_time: number) {
    debug.profilebegin("CameraWorkerController::onRender");
    this.currentWorker?.update(delta_time);
    debug.profileend();
  }

  /** Attempts to start worker */
  public startWorker(worker_name: string): Result<BaseCameraWorker, true> {
    // avoid working with multiple workers
    if (this.currentWorker) {
      this.logger.Error("Attempt to start camera worker but it has a worker ({WorkerName})", worker_name);
      return Result.err(true);
    }

    // trying to find a worker class
    const info = this.workers.get(worker_name);
    const worker = info?.worker;
    if (worker === undefined) {
      this.logger.Error("{WorkerName} does not exists as a worker", worker_name);
      return Result.err(true);
    }

    // trying to start the worker
    this.logger.Debug("Starting camera worker: {WorkerName} ({WorkerId})", worker_name, info!.flameworkId);
    worker.start();
    this.currentWorker = worker;

    return Result.ok(worker);
  }

  /** @hidden */
  public onInit() {
    const init = new Array<BaseCameraWorker & OnCameraWorkerInit>();

    // registering workers
    for (const [id, ctor] of Reflect.idToObj) {
      // get the decorator metadata and the config
      const config = Reflect.getOwnMetadata<DecoratorMetadata<[CameraWorkerConfig]>>(ctor, worker_decorator_id)
        ?.arguments[0];
      if (config === undefined) continue;

      // checking for existing worker
      if (this.workers.has(config.name)) {
        this.logger.Fatal(
          "Duplicated camera worker: {WorkerName}. {FlameworkId} class will be ignored",
          config.name,
          id,
        );
        continue;
      }

      // resolve dependency from Flamework (because they create dependency)
      // and idk how to not create dependency upon startup
      const instance = Flamework.resolveDependency(id);

      // working sure that dependency must be extended from BaseCameraWorker
      if (!(instance instanceof BaseCameraWorker)) {
        this.logger.Fatal("{WorkerId} is required to extend a class as BaseCameraWorker. It will be ignored", id);
        continue;
      }
      instance.config = config;
      instance.hookInfo = {
        start: Flamework.implements<OnCameraWorkerStart>(ctor),
        attributeChanged: Flamework.implements<OnCameraWorkerAttributeChanged>(ctor),
        render: Flamework.implements<OnCameraWorkerRender>(ctor),
      };

      // implemented interface stuff
      if (Flamework.implements<OnCameraWorkerInit>(ctor)) {
        init.push(instance as BaseCameraWorker & OnCameraWorkerInit);
      }

      this.logger.Debug("Registered camera worker: {WorkerName}", id);

      // // registration completed
      this.workers.set(config.name, {
        worker: instance,
        ctor: ctor as Constructor<BaseCameraWorker>,
        flameworkId: id,
      });
    }

    // initialize workers if they are implemented with OnInit
    for (const worker of init) {
      task.spawn(() => worker.onWorkerInit());
    }
  }
}
