import { t } from "@rbxts/t";
import { GameFlags } from "shared/flags";

export const DEFAULT_PLAYER_DATA = {
  /**
   * Default version of player's data.
   *
   * **MUST BE AN ABSOLUTE INTEGER OR DATA MIGRATION MAY CAUSE PROBLEMS**
   */
  Version: GameFlags.PlayerDataVersion,

  /** Player's settings for the game */
  Settings: {},
};

/** Typechecker for `PlayerData` */
export const PlayerDataCheck: t.check<typeof DEFAULT_PLAYER_DATA> = t.interface({
  // stressing out the migration system
  Version: t.literal(GameFlags.PlayerDataVersion),
  Settings: t.table,
});

export const GAME_VERSION = `${GameFlags.NodeEnvironment !== "production" ? "DEV " : ""}${PKG_VERSION}`;
