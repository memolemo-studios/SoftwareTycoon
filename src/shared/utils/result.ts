import { Option, Result } from "@rbxts/rust-classes";

/**
 * Result object doesn't have `errOr` methods.
 *
 * It is like `okOrElse` but it returns as `Err` variant
 * belong with the error argument provided if the Option value is `Some`.
 */
export function errOrElse<T, E>(option: Option<T>, err: (value: T) => E) {
  return option.match(
    (value) => Result.err<[], E>(err(value)),
    () => Result.ok<[], E>([]),
  );
}
