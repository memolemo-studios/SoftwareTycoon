import { Option } from "@rbxts/rust-classes";

export namespace OptionUtil {
  /**
   * Combines two options into a single option with multiple arguments
   * @param a Option A to combine with
   * @param b Option B to combine with A
   */
  export function union<A extends defined, B extends defined>(a: Option<A>, b: Option<B>) {
    return a.and(b).map(b_val => [a.unwrap(), b_val] as const);
  }
}
