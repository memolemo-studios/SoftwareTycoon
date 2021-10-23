/* eslint-disable @typescript-eslint/no-explicit-any */

import { t } from "@rbxts/t";

export interface ComponentConfig<T extends Instance = Instance> {
	tag?: string;
	withinDescendants?: Instance[];
	instanceCheck?: t.check<T>;
	requiredComponents?: string[];
}

export function Component<T extends Instance = Instance>(cfg: ComponentConfig<T>): any;
