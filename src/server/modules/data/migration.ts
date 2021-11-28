import { deepCopy } from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";
import { GameFlags } from "shared/flags";
import { PlayerData } from "types/game/data";

interface RootPlayerData {
  Version: number;
}

interface PlayerDataV0 {
  Version: number;
  Settings: string;
}

type PlayerDataV1 = PlayerData;

/*
  These are data migration functions that
  all versions must be converted one by one.

  Guide:
  - Index - a target data version to migrate to the next step version (e.g: target - v1 and migrate - v2)
  - Value - data conversion
*/
const migration_callbacks = new Map<number, (data: RootPlayerData) => RootPlayerData>([
  [
    0,
    temp => {
      const raw = temp as unknown as PlayerDataV0;
      const data = temp as unknown as PlayerDataV1;
      data.Settings = HttpService.JSONDecode(raw.Settings);
      return data;
    },
  ],
]);

/**
 * Attempts to convert player's old data to the newest game data available
 *
 * **NOTE**: This function cannot verify if it totally works everytime.
 * Make sure to use typechecking to verify the migration.
 */
export function migratePlayerData(data: RootPlayerData): [boolean, PlayerData] {
  // check the current version of player's data
  if (data.Version < GameFlags.PlayerDataVersion) {
    // deep copy player's profile data
    data = deepCopy(data);

    // iterate through all the versions from player's version to
    // the game's current version
    let i = data.Version;
    do {
      data = migration_callbacks.get(i)!(data);
    } while (i++ < GameFlags.PlayerDataVersion - 1);

    // set the new game data version
    data.Version = GameFlags.PlayerDataVersion;
    return [true, data as unknown as PlayerData];
  }
  return [false, data as unknown as PlayerData];
}
