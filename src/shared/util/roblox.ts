import { promiseTree } from "@rbxts/validate-tree";
import { BaseCharacterModel } from "types/roblox";

export namespace RobloxUtil {
	export function assetUrlWithId(id: number) {
		return `rbxassetid://${id}`;
	}
}

export function promiseForCharacter(model: Model): Promise<BaseCharacterModel> {
	return promiseTree(model, {
		$className: "Model",
		Head: {
			$className: "BasePart",
			face: "Decal",
		},
		HumanoidRootPart: "BasePart",
		Humanoid: "Humanoid",
		"Body Colors": "BodyColors",
	});
}
