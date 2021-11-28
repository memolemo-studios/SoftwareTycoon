import { Dependency } from "@flamework/core";
import { useEffect, useState } from "@rbxts/roact-hooked";
import { RunService } from "@rbxts/services";
import { DataController } from "client/controllers/player/DataController";
import { DEFAULT_PLAYER_DATA } from "shared/definitions/game";

let data_controller: DataController;

// Hoarcekat cases
function getPlayerDataOrDefault() {
  if (RunService.IsRunning()) {
    // reload DataController
    if (data_controller === undefined) {
      data_controller = Dependency<DataController>();
    }
    // grab it!
    return data_controller.getPlayerData();
  }
  return DEFAULT_PLAYER_DATA;
}

/** Hooker function takes or reloads player's data and returns it */
export function usePlayerData() {
  const [data, set_data] = useState(getPlayerDataOrDefault());

  // modify something when player's data changes
  useEffect(() => {
    const conn = data_controller.onDataChanged.Connect(new_data => {
      set_data(new_data);
    });
    return () => conn.Disconnect();
  });

  return data;
}
