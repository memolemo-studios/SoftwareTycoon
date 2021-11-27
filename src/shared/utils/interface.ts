import { GameFlags } from "shared/flags";

/**
 * Gets the invisible transparency based on `GameFlags` configured
 */
export function useInvisibleTransparency() {
  return GameFlags.GhostInvisibleUI ? GameFlags.GhostInvisibleUITransparency : 1;
}
