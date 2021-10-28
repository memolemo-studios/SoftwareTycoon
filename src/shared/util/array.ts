import { Option } from "@rbxts/rust-classes";

const rng = new Random();

namespace ArrayUtil {
	/**
	 * Gets a random array member if the array is not empty
	 *
	 * `Option.some()` -> If the array member is not empty
	 *
	 * `Option.none()` -> If the array is empty
	 *
	 * @param array Array to get a random member to
	 * @returns Option
	 */
	export function getRandomMember<T extends defined>(array: T[]): Option<T> {
		return array.isEmpty() ? Option.none() : Option.wrap(array[rng.NextInteger(0, array.size() - 1)]);
	}
}

export = ArrayUtil;
