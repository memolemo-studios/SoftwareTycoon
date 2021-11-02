export interface CameraDebugConfig {
	ROTATION: Vector3;
	POSITION: Vector3;
	ROTATION_DAMPER: number;
	ROTATION_SPEED: number;
	POSITION_DAMPER: number;
	POSITION_SPEED: number;
}

export const CameraDebugConfig: CameraDebugConfig = {
	ROTATION: new Vector3(0, 0, 0),
	POSITION: new Vector3(0, 0, 0),
	ROTATION_DAMPER: 1,
	ROTATION_SPEED: 2,
	POSITION_DAMPER: 1,
	POSITION_SPEED: 2,
};
