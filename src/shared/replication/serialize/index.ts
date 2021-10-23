import { Option, Result } from "@rbxts/rust-classes";
import { t } from "@rbxts/t";

export namespace SerTypes {
	export type Result<S = defined, V = defined> = { type: "Ok"; value: S } | { type: "Err"; value: V };
	export const Result: t.check<Result> = t.union(
		t.strictInterface({
			type: t.literal("Ok"),
			value: t.any,
		}),
		t.strictInterface({
			type: t.literal("Err"),
			value: t.any,
		}),
	);

	export type Option<T extends defined = defined> = { type: "None" } | { type: "Some"; value: T };
	export const Option = t.union(
		t.strictInterface({
			type: t.literal("None"),
		}),
		t.strictInterface({
			type: t.literal("Some"),
			value: t.any,
		}),
	);
}

export namespace Deserialize {
	/** Deserializes result */
	export function result<S extends defined, F extends defined>(output: SerTypes.Result<S, F>): Result<S, F>;
	export function result<S extends defined, F extends defined>(output: unknown): Result<defined, defined>;
	export function result<S extends defined, F extends defined>(
		output: SerTypes.Result<S, F> | unknown,
	): Result<S, F> {
		assert(SerTypes.Result(output), "Invalid serialized 'Result' value");
		if (output.type === "Err") {
			return Result.err(output.value as F);
		}
		return Result.ok(output.value as S);
	}

	/** Deserializes option */
	export function option<T>(output: unknown | SerTypes.Option<T>) {
		assert(SerTypes.Option(output), "Invalid serialized 'Option' value");
		if (output.type === "None") {
			return Option.none<T>();
		}
		return Option.some<T>(output.value as T);
	}
}

export namespace Serialize {
	/** Serialized result */
	export function result<S, F>(value: Result<S, F>): SerTypes.Result<S, F> {
		if (value.isErr()) {
			return { type: "Err", value: value.unwrapErr() };
		}
		return { type: "Ok", value: value.unwrap() };
	}

	/** Serializes option */
	export function option<T>(value: Option<T>): SerTypes.Option<T> {
		if (value.isNone()) {
			return { type: "None" };
		}
		return { type: "Some", value: value.unwrap() };
	}
}
