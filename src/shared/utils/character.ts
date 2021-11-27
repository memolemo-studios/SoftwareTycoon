import { promiseTree } from "@rbxts/validate-tree";
import { BaseCharacterModel } from "types/roblox";

// I don't want to use roblox-ts character util packages
// because there are no choices for base character model
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
