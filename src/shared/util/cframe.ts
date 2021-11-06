namespace CFrameUtil {
	/**
	 * Combines position and rotation Vector3s into a single CFrame object
	 * @param position Position to make a CFrame
	 * @param rotation Rotation to make a CFrame (in radians)
	 */
	export function fromPositionAndRotation(position: Vector3, { X: RX, Y: RY, Z: RZ }: Vector3) {
		// fixed: https://devforum.roblox.com/t/camera-not-angling/136405/6
		return CFrame.fromOrientation(RX, RY, RZ).add(position);
	}

	/**
	 * Creates a line CFrame with size provided depending on
	 * head and tail positions based on the parameters required.
	 * @param head Head for line construction
	 * @param tail Tail for the line construction
	 * @returns A line CFrame with size provided
	 */
	export function makeLine(head: Vector3, tail: Vector3) {
		const distance = head.sub(tail).Magnitude;
		const cframe = CFrame.lookAt(head, tail).mul(new CFrame(0, 0, -distance / 2));
		return [cframe, distance] as const;
	}

	/**
	 * Converts CFrame into Vector3
	 * @param cframe CFrame to convert to
	 */
	export function convertToVector(cf: CFrame) {
		const [rx, ry, rz] = cf.ToEulerAnglesXYZ();
		return [cf.Position, new Vector3(rx, ry, rz)] as const;
	}
}

export = CFrameUtil;
