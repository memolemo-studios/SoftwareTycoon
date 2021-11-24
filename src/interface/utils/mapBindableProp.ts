import Roact from "@rbxts/roact";
import { RoactUtil } from "shared/utils/roact";

/** TODO: Add documentation */
export function mapBindableProp<T, V>(value: T | Roact.Binding<T>, callback: (value: T) => V): V | Roact.Binding<V> {
  if (RoactUtil.isBinding(value)) {
    return value.map(callback);
  }
  return callback(value);
}
