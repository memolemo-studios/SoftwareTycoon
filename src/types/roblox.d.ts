/** Alternative to ChangedSignal provided in roblox-ts documentation */
export type ChangedSignal<T extends Instance> = T & {
	Changed: RBXScriptSignal<(changedPropertyName: InstancePropertyNames<T>) => void>;
};
