export function rbxAssetUrlWithId(id: number) {
	return `rbxassetid://${id}`;
}

export type ChangedSignal<T extends Instance> = T & {
	Changed: RBXScriptSignal<(this: T, changedPropertyName: InstancePropertyNames<T>) => void>;
};
