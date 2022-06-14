import { RunService } from "@rbxts/services";

/**
 * A helper function checks if the game is in
 * production version.
 */
export function isGameInProduction() {
  // TODO(memothelemo): add non-production game ids
  return !RunService.IsStudio();
}
