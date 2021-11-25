import { createContext } from "@rbxts/roact";
import { ValueOrBinding } from "types/roact";

/**
 * Context for the transparency.
 *
 * It will apply the transparency amongst
 * the descendants depending on the context value
 * being applied.
 */
export const TransparencyContext = createContext<ValueOrBinding<number>>(0);
