import { BaseCameraWorkerAttributes } from "client/cameras/base";

/**
 * Hook into the OnCameraWorkerAttributeChanged
 *
 * *long name, I should name it something else*
 */
export interface OnCameraWorkerAttributeChanged {
  /**
   * This method will be called whenever any debug attribute
   * is changed.
   */
  onAttributeChanged(changed?: string): void;
  onAttributeChanged(changed?: keyof BaseCameraWorkerAttributes): void;
}

/** Hook into the OnCameraWorkerRender */
export interface OnCameraWorkerRender {
  /**
   * This function has the same functionality as `OnRender` on Flamework
   */
  onWorkerRender(deltaTime: number): void;
}

/** Hook into the OnCameraWorkerInit */
export interface OnCameraWorkerInit {
  /**
   * This function will be called whenever the camera worker is initialized
   * during Flamework initialization stage.
   *
   * This should only used upon preparing for a class.
   */
  onWorkerInit(): void;
}

/** Hook into the OnCameraWorkerStart event */
export interface OnCameraWorkerStart {
  /**
   * This function will be called whenever the camera worker is started
   * from `CameraControler.startWorker` method
   *
   * This should only used upon preparing for a worker session.
   */
  onWorkerStart(): void;
}

export interface CameraWorkerHookInfo {
  start: boolean;
  render: boolean;
  attributeChanged: boolean;
}

export interface CameraWorkerConfig {
  name: string;
  defaultAttributes?: Record<string, unknown>;
}

/** Register a class as a CameraWorker */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function CameraWorker(cfg: CameraWorkerConfig): any;
