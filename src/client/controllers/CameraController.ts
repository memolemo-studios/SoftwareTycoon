import { Controller, OnRender, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Workspace } from "@rbxts/services";
import BaseScriptableCamera from "client/cameras/base";
import PlacementScriptableCamera from "client/cameras/placement";
import SpringScriptableCamera from "client/cameras/spring";

const script_cam_types = {
	Static: BaseScriptableCamera,
	Spring: SpringScriptableCamera,
	Placement: PlacementScriptableCamera,
};

type ScriptCamTypes = typeof script_cam_types;

@Controller({})
export class CameraController implements OnRender, OnStart {
	private logger = Log.ForContext(CameraController);
	private currentSession?: BaseScriptableCamera;

	// TODO: Use DEBUG_MODE environment variable to do this
	private debugMode = true;

	/**
	 * Terminates the current session of the scriptable camera
	 *
	 * **NOTE**: This method will never returned if the current session
	 * scriptable camera is already terminated
	 */
	public terminateScriptableSession() {
		if (this.currentSession !== undefined) {
			this.logger.Info("Terminating current ScriptableCamera session");

			this.currentSession.destroy();
			this.currentSession = undefined;
		}
	}

	/**
	 * Gets the current session of the scriptable camera
	 * @returns Option with current session scriptable camera
	 */
	public getScriptableSession<T extends BaseScriptableCamera = BaseScriptableCamera>() {
		return Option.wrap(this.currentSession as T);
	}

	/**
	 * Makes a new scriptable camera with type argument
	 *
	 * **NOTE**: This will not run if it is already in session
	 * @param typeName Any kind of scriptable camera that supports
	 */
	public runScriptableSession<K extends keyof ScriptCamTypes>(typeName: K): Option<ScriptCamTypes[K]> {
		// making sure it is not in session
		if (this.currentSession) return Option.none();

		// look for that scriptable camera type
		const scriptable_cam_constructor = script_cam_types[typeName];
		assert(scriptable_cam_constructor !== undefined, "Invalid type!");

		const scriptable_cam = new scriptable_cam_constructor(this.debugMode);
		scriptable_cam.start();

		this.currentSession = scriptable_cam;
		this.logger.Info("Running ScriptableCamera session. ({Type})", typeName);

		return Option.some(scriptable_cam as unknown as ScriptCamTypes[K]);
	}

	/**
	 * Gets the current camera
	 * @returns Option
	 */
	public getCamera() {
		return Option.wrap(Workspace.CurrentCamera);
	}

	/** @hidden */
	public onRender(dt: number) {
		this.currentSession?.update(dt);
	}

	/** @hidden */
	public onStart() {
		this.runScriptableSession("Placement");
	}
}
