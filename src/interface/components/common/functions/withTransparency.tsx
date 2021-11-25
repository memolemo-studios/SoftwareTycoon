import Roact from "@rbxts/roact";
import { ValueOrBinding } from "types/roact";
import { TransparencyContext } from "../context/transparency";

/** Wraps from the callback parameter by using TransparencyContext */
export function withTransparency(callback: (transparency: ValueOrBinding<number>) => Roact.Element) {
  return <TransparencyContext.Consumer render={callback} />;
}
