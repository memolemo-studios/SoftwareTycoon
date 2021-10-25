import Attributes from "@memolemo-studios/rbxts-attributes";
import { Janitor } from "@rbxts/janitor";
import { SupportedAttributeValues } from "shared/types/roblox";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyBaseComponent = BaseComponent<Instance, any>;

export class BaseComponent<C extends Instance = Instance, A extends object = {}> {
	protected janitor = new Janitor();
	protected attributes!: Attributes<A[keyof A] extends SupportedAttributeValues ? A : never>;

	public instance!: C;

	/** @hidden */
	public setInstance(instance: C) {
		this.instance = instance;
		this.attributes = new Attributes(instance);
	}

	public destroy() {
		this.janitor.Destroy();
	}
}
