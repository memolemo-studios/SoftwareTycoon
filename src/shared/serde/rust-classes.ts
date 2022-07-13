import { Option, Result } from "@rbxts/rust-classes";
import { t } from "@rbxts/t";
import { SerializedOption, SerializedResult } from "types/serde/rust-classes";

const optionCheck = t.union(
  t.interface({
    type: t.literal("Some"),
    value: t.any,
  }),
  t.interface({
    type: t.literal("None"),
  }),
);

const resultCheck = t.union(
  t.interface({
    type: t.literal("Ok"),
    value: t.any,
  }),
  t.interface({
    type: t.literal("Err"),
    value: t.any,
  }),
);

export function deserializeOption<T extends defined>(serialized: unknown): Option<Option<T>>;
export function deserializeOption<T extends defined>(
  serialized: SerializedOption<T>,
): Option<Option<T>>;
export function deserializeOption<T extends defined>(serialized: unknown): Option<Option<T>> {
  if (!optionCheck(serialized)) return Option.none<Option<T>>();
  if (serialized.type === "None") {
    return Option.some<Option<T>>(Option.none<T>());
  }
  return Option.some<Option<T>>(Option.some<T>(serialized.value as T));
}

export function serializeOption<T extends defined>(option: Option<T>) {
  return option.match<SerializedOption<T>>(
    (value) => ({
      type: "Some",
      value,
    }),
    () => ({
      type: "None",
    }),
  );
}

export function deserializeResult<O extends defined, E extends defined>(
  serialized: unknown,
): Option<Result<O, E>>;
export function deserializeResult<O extends defined, E extends defined>(
  serialized: SerializedResult<O, E>,
): Option<Result<O, E>>;
export function deserializeResult<O extends defined, E extends defined>(
  serialized: unknown,
): Option<Result<O, E>> {
  if (!resultCheck(serialized)) return Option.none<Result<O, E>>();
  if (serialized.type === "Ok") {
    return Option.some<Result<O, E>>(Result.ok<O, E>(serialized.value as O));
  }
  return Option.some<Result<O, E>>(Result.err<O, E>(serialized.value as E));
}

export function serializeResult<O extends defined, E extends defined>(result: Result<O, E>) {
  return result.match<SerializedResult<O, E>>(
    (value) => ({
      type: "Ok",
      value,
    }),
    (value) => ({
      type: "Err",
      value,
    }),
  );
}
