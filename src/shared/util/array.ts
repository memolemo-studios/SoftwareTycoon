import { Option } from "@rbxts/rust-classes";

const rng = new Random();

export function getRandomArrayMember<T extends defined>(array: T[]) {
	if (array.isEmpty()) {
		return Option.none<T>();
	}
	return Option.wrap(array[rng.NextInteger(0, array.size() - 1)]);
}
