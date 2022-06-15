/**
 * Tags for each component in the game and then it replaces
 * it to literal in compile time.
 *
 * **Before compilation**:
 * ```ts
 * const tag = ComponentTags.Lot;
 * ```
 *
 * **After compilation**:
 * ```lua
 * local tag = "Lot"
 * ```
 */
export const enum ComponentTags {
  Lot = "Lot",
}
