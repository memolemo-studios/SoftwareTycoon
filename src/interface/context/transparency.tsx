import Roact, { createContext } from "@rbxts/roact";
import { RoactBindable } from "types/roact/value";

const TransparencyContext = createContext<RoactBindable<number>>(0);

export default TransparencyContext;

/**
 * Wrapper for TransaprencyContext
 *
 * **IMPORTANT**: Make sure you have a context for
 * TransparencyContext otherwise some elements don't work
 * well with transparency
 */
export function withTransparency(callback: (alpha: RoactBindable<number>) => Roact.Element) {
	return <TransparencyContext.Consumer render={callback} />;
}
