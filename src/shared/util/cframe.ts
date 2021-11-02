namespace CFrameUtil {
	/**
	 * Combines position and rotation Vector3s into a single CFrame object
	 * @param position Position to make a CFrame
	 * @param rotation Rotation to make a CFrame (in radians)
	 */
	export function fromPositionAndRotation({ X, Y, Z }: Vector3, { X: RX, Y: RY, Z: RZ }: Vector3) {
		return new CFrame(X, Y, Z).mul(CFrame.Angles(RX, RY, RZ));
	}
}

export = CFrameUtil;
