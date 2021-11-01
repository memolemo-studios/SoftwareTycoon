import Attributes from "@memolemo-studios/rbxts-attributes";
import { Bin } from "@rbxts/bin";
import { Option } from "@rbxts/rust-classes";
import { Workspace } from "@rbxts/services";
import Spring from "shared/classes/spring";
import { CameraDebugConfig } from "shared/constants/camera";
import CFrameUtil from "shared/util/cframe";
import VectorUtil from "shared/util/vector";

// long constant values
const {
	CAMERA_ANGLE,
	CAMERA_POSITION,
	CAMERA_POSITION_DAMPER,
	CAMERA_POSITION_SPEED,
	CAMERA_ROTATION_DAMPER,
	CAMERA_ROTATION_SPEED,
} = CameraDebugConfig;

interface Attrib {
	CameraAngle: Vector3;
	CameraPosition: Vector3;
	CameraPositionDamper: number;
	CameraPositionSpeed: number;
	CameraRotationDamper: number;
	CameraRotationSpeed: number;
}

/** Bare bones of ScriptableCamera */
export default class BaseScriptableCamera {
	/** Use this for debugging purposes */
	protected attributes?: Attributes<Attrib>;
	protected bin = new Bin();
	protected dummyDebugger?: Folder;

	protected positionSpring = new Spring(new Vector3());
	protected rotationSpring = new Spring(new Vector3());

	public constructor(public readonly debugMode = false) {
		// debug attributes
		if (this.debugMode) {
			const dummy_debugger = new Instance("Folder");
			this.dummyDebugger = dummy_debugger;
			this.attributes = new Attributes(dummy_debugger);
			this.bin.add(this.attributes);

			// making a temporary instance?
			dummy_debugger.Name = "DUMMY_CAM_ATTRIBS";
			dummy_debugger.Parent = Workspace;
			this.bin.add(dummy_debugger);

			this.attributes.setMultiple({
				CameraAngle: CAMERA_ANGLE,
				CameraPosition: CAMERA_POSITION,
				CameraPositionDamper: CAMERA_POSITION_DAMPER,
				CameraPositionSpeed: CAMERA_POSITION_SPEED,
				CameraRotationDamper: CAMERA_ROTATION_DAMPER,
				CameraRotationSpeed: CAMERA_ROTATION_SPEED,
			});

			// one ship container
			this.bin.add(
				this.attributes.changed.Connect(() => {
					const current_attribs = this.attributes!.getAll();
					this.setPosition(current_attribs.CameraPosition!);
					this.setRotation(current_attribs.CameraAngle!);
					this.setPositionSpringDamping(current_attribs.CameraPositionDamper!);
					this.setRotationSpringDamping(current_attribs.CameraRotationDamper!);
					this.setPositionSpringSpeed(current_attribs.CameraPositionSpeed!);
					this.setRotationSpringSpeed(current_attribs.CameraRotationSpeed!);
				}),
			);

			this.setupDebugAttributes();
		}
	}

	/** Sets up other debug attributes */
	protected setupDebugAttributes() {}

	/**
	 * Sets the speed of the rotation spring
	 * @param speed Speed value to change
	 */
	public setRotationSpringSpeed(speed: number) {
		this.rotationSpring.Speed = speed;

		// attributes update
		this.attributes?.set("CameraRotationSpeed", speed);
	}

	/**
	 * Sets the speed of the position spring
	 * @param speed Speed value to change
	 */
	public setPositionSpringSpeed(speed: number) {
		this.positionSpring.Speed = speed;

		// attributes update
		this.attributes?.set("CameraPositionSpeed", speed);
	}

	/**
	 * Sets the damping of the rotation spring
	 * @param damping Damping value to change
	 */
	public setRotationSpringDamping(damping: number) {
		this.rotationSpring.Damper = damping;

		// attributes update
		this.attributes?.set("CameraRotationDamper", damping);
	}

	/**
	 * Sets the damping of the position spring
	 * @param damping Damping value to change
	 */
	public setPositionSpringDamping(damping: number) {
		this.positionSpring.Damper = damping;

		// attributes update
		this.attributes?.set("CameraPositionDamper", damping);
	}

	/**
	 * Sets the current position of the camera
	 * @param vector Destination vector
	 */
	public setPosition(vector: Vector3) {
		this.positionSpring.Target = vector;

		// attributes update
		this.attributes?.set("CameraPosition", vector);
	}

	/**
	 * Sets the current rotation of the camera
	 * @param vector Destination angle (in degress)
	 */
	public setRotation(vector: Vector3) {
		// convert this radians
		const radian_vector = VectorUtil.toRadians(vector);
		this.rotationSpring.Target = radian_vector;

		// attributes update
		this.attributes?.set("CameraAngle", vector);
	}

	/**
	 * Updates the `Workspace.CurrentCamera` object's position and rotation
	 *
	 * Only run this when using `RenderStepped` or `Heartbeat` events
	 */
	public updateCamera() {
		// make a cframe instantly
		const cframe = CFrameUtil.fromPositionAndRotation(this.positionSpring.Position, this.rotationSpring.Position);

		// transition away ^_^
		this.getCamera().map(cam => (cam.CFrame = cframe));
	}

	/**
	 * Only run this when using `RenderStepped` or `Heartbeat` events
	 * @param deltaTime Render delta time
	 */
	public onTick(deltaTime: number) {
		this.updateCamera();
	}

	/** Gets the Camera instance */
	public getCamera() {
		return Option.wrap(Workspace.CurrentCamera);
	}

	/** Destroys ScriptableCamera */
	public destroy() {
		this.bin.destroy();
	}
}
