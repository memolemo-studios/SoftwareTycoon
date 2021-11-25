import Roact from "@rbxts/roact";
import { RoactUtil } from "shared/utils/roact";

/**
 * Maps a value or binding with a value parameter typed
 * for either Roact.Binding or a native value.
 *
 * Useful if the property type is `ValueOrBinding`.
 */
export function mapBindableProp<T, V>(value: T | Roact.Binding<T>, callback: (value: T) => V): V | Roact.Binding<V> {
  if (RoactUtil.isBinding(value)) {
    return value.map(callback);
  }
  return callback(value);
}
