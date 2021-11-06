namespace VectorUtil {
	/**
	 * Calculates the true model size
	 * @param cf CFrame to adjust
	 * @param size Total size
	 * @returns World space bounding box with Vector3
	 */
	export function worldBoundingBox(cf: CFrame, size: Vector3) {
		const h_size = size.div(2);

		const c1 = cf.VectorToWorldSpace(new Vector3(h_size.X, h_size.Y, h_size.Z));
		const c2 = cf.VectorToWorldSpace(new Vector3(-h_size.X, h_size.Y, h_size.Z));
		const c3 = cf.VectorToWorldSpace(new Vector3(-h_size.X, -h_size.Y, h_size.Z));
		const c4 = cf.VectorToWorldSpace(new Vector3(-h_size.X, -h_size.Y, -h_size.Z));
		const c5 = cf.VectorToWorldSpace(new Vector3(h_size.X, -h_size.Y, -h_size.Z));
		const c6 = cf.VectorToWorldSpace(new Vector3(h_size.X, h_size.Y, -h_size.Z));
		const c7 = cf.VectorToWorldSpace(new Vector3(h_size.X, -h_size.Y, h_size.Z));
		const c8 = cf.VectorToWorldSpace(new Vector3(-h_size.X, h_size.Y, -h_size.Z));

		const max = new Vector3(
			math.max(c1.X, c2.X, c3.X, c4.X, c5.X, c6.X, c7.X, c8.X),
			math.max(c1.Y, c2.Y, c3.Y, c4.Y, c5.Y, c6.Y, c7.Y, c8.Y),
			math.max(c1.Z, c2.Z, c3.Z, c4.Z, c5.Z, c6.Z, c7.Z, c8.Z),
		);

		const min = new Vector3(
			math.min(c1.X, c2.X, c3.X, c4.X, c5.X, c6.X, c7.X, c8.X),
			math.min(c1.Y, c2.Y, c3.Y, c4.Y, c5.Y, c6.Y, c7.Y, c8.Y),
			math.min(c1.Z, c2.Z, c3.Z, c4.Z, c5.Z, c6.Z, c7.Z, c8.Z),
		);

		return max.sub(min);
	}

	/**
	 * Converts all degree vector coordinates into radians coordinates
	 * @param vector Vector in degress
	 * @returns Vector3 with radian coordinates
	 */
	export function toRadians({ X, Y, Z }: Vector3) {
		return new Vector3(math.rad(X), math.rad(Y), math.rad(Z));
	}
}

export = VectorUtil;
