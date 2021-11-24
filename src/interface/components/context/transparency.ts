import { createContext } from "@rbxts/roact";
import { ValueOrBinding } from "types/roact";

export const TransparencyContext = createContext<ValueOrBinding<number>>(0);
