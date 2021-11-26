export interface BaseCharacterModel extends Model {
  Head: BasePart & {
    face: Decal;
  };
  HumanoidRootPart: BasePart;
  Humanoid: Humanoid;
  "Body Colors": BodyColors;
}
