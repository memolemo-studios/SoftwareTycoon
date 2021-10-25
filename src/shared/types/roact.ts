import { Binding, ComponentConstructor } from "@rbxts/roact";

export type OrBinding<T> = T | Binding<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferComponentProps<T extends ComponentConstructor<any, any>> = T extends ComponentConstructor<infer P>
	? P
	: never;
