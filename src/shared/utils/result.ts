import { Option, Result } from "@rbxts/rust-classes";

/**
 * Result object doesn't have `errOr` methods.
 *
 * It is like `okOrElse` but it returns as `Err` variant
 * belong with the error argument provided if the Option value is `Some`.
 */
export function errOrElse<T extends defined, E extends defined>(
  option: Option<T>,
  err: (value: T) => E,
) {
  return option.match<Result<[], E>>(
    (value) => Result.err(err(value)),
    // @ts-ignore
    () => Result.ok([]),
  );
}
