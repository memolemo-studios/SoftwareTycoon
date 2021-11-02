import { BaseCharacterModel } from "types/roblox";

/** Character utilities */
namespace CharacterUtil {
	/** Watches a character until it dies */
	export function watchToDie(character: BaseCharacterModel, callback: () => void) {
		return character.Humanoid.Died.Connect(callback);
	}
}

export = CharacterUtil;
