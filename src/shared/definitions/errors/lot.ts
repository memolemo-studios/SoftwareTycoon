import variantModule, { fields, variant, VariantOf } from "@rbxts/variant";

/**
 * Reasons why the player failed to claim the desired lot
 * they want for the game.
 *
 * **About these variants**:
 *
 * `PlayerOwned` - The player has already owned or claimed to other lot.
 * `LotOwned` - The lot has already an owner assigned.
 * `ClearedOwner` - The lot is already cleared or has no owner.
 */
export const LotOwnError = variantModule({
  PlayerOwned: fields<{ lotId: string }>(),
  LotOwned: fields<{ ownerId: number }>(),
  ClearedOwner: variant("ClearedOwnership"),
});
export type LotOwnError = VariantOf<typeof LotOwnError>;
