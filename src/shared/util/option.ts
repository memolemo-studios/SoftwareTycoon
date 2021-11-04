import { Option } from "@rbxts/rust-classes";

namespace OptionUtil {
	/**
	 * Combines two option parameters into 2 parameter callback
	 * @param optionA Option A to assign with
	 * @param optionB Option B to assign with
	 */
	export function combine<A extends defined, B extends defined>(
		optionA: Option<A>,
		optionB: Option<B>,
	): Option<[A, B]> {
		// check if either of them are some
		if (optionA.isNone() || optionB.isNone()) return Option.none();

		// unwrap them and creating a new option
		const some_value_a = optionA.unwrap();
		const some_value_b = optionB.unwrap();

		return Option.some([some_value_a, some_value_b]);
	}
}

export = OptionUtil;
