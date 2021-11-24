import { GameFlags } from "shared/flags";

/** TODO: Document this function */
export function useInvisibleTransparency() {
  return GameFlags.GhostInvisibleUI ? GameFlags.GhostInvisibleUITransparency : 1;
}
