export interface CameraDebugConfig {
	CAMERA_ANGLE: Vector3;
	CAMERA_POSITION: Vector3;
	CAMERA_POSITION_DAMPER: number;
	CAMERA_POSITION_SPEED: number;
	CAMERA_ROTATION_DAMPER: number;
	CAMERA_ROTATION_SPEED: number;
}

export const CameraDebugConfig: CameraDebugConfig = {
	CAMERA_ANGLE: new Vector3(0, 0, 0),
	CAMERA_POSITION: new Vector3(0, 0, 0),
	CAMERA_POSITION_DAMPER: 1,
	CAMERA_POSITION_SPEED: 2,
	CAMERA_ROTATION_DAMPER: 1,
	CAMERA_ROTATION_SPEED: 2,
};
