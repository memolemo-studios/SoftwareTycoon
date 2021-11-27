/** ROBLOX's Base character model */
export interface BaseCharacterModel extends Model {
  Head: BasePart & {
    face: Decal;
  };
  HumanoidRootPart: BasePart;
  Humanoid: Humanoid;
  "Body Colors": BodyColors;
}

/**
 * Supported types/values in attributes
 *
 * Source: https://developer.roblox.com/en-us/articles/instance-attributes
 */
export type SupportedAttributeTypes =
  | string
  | boolean
  | number
  | UDim
  | UDim2
  | BrickColor
  | Color3
  | Vector2
  | Vector3
  | NumberSequence
  | ColorSequence
  | NumberRange
  | Ray
  | undefined;
