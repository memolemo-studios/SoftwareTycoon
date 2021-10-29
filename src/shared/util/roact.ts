import Roact from "@rbxts/roact";
import StringUtils from "@rbxts/string-utils";

/** Utility functions for Roact */
export namespace RoactUtil {
	/** Returns a boolean if that value is a Roact binding */
	export function isBinding<T>(object: Roact.Binding<T>): object is Roact.Binding<T>;
	export function isBinding(object: unknown): object is Roact.Binding<unknown>;
	export function isBinding<T>(object: unknown | Roact.Binding<T>): object is Roact.Binding<T> {
		// check if it is a table
		if (!typeIs(object, "table")) {
			return false;
		}

		// simple but exploitable, I will find a way how to do this
		return StringUtils.startsWith(tostring(object), "RoactBinding");
	}
}
