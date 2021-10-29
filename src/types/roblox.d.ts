/** Alternative to ChangedSignal provided in roblox-ts documentation */
export type ChangedSignal<T extends Instance> = T & {
	Changed: RBXScriptSignal<(changedPropertyName: InstancePropertyNames<T>) => void>;
};

/**
 * Base character model for every player.
 * It supports both R6 and R15.
 */
export interface BaseCharacterModel extends Model {
	Head: BasePart & {
		face: Decal;
	};
	HumanoidRootPart: BasePart;
	Humanoid: Humanoid;
	"Body Colors": BodyColors;
}
