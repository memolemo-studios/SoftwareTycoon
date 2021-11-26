import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Signal from "@rbxts/signal";
import { DEFAULT_PLAYER_DATA } from "shared/definitions/game";
import { PlayerData } from "types/game/data";
import { LocalStorageController } from "../replication/LocalStorageController";

@Controller({})
export class DataController implements OnStart {
  private dataCache = DEFAULT_PLAYER_DATA;
  private logger = Log.ForContext(DataController);

  public onDataChanged = new Signal<(newData: PlayerData) => void>();

  public constructor(private localStorage: LocalStorageController) {}

  /**
   * Tries to reload player's data from the server
   * and override its cache
   */
  public async reloadPlayerData() {
    const data = await this.localStorage.getContainer("PlayerData", true);

    // modify the new data to the cache
    this.dataCache = data;
    return data;
  }

  /** Gets the current player data from cache */
  public getPlayerData() {
    return this.dataCache;
  }

  /** @hidden */
  public onStart() {
    // get player's data from server or override it using the default data
    this.logger.Info("Fetching player's data from the server storage container");
    this.localStorage
      .getContainer("PlayerData")
      .then(data => {
        this.logger.Info("Fetching data done!");
        this.dataCache = data;
      })
      .catch(() => {});

    // any data changes
    this.localStorage.onContainerChanged("PlayerData", new_data => {
      this.dataCache = new_data;
      this.onDataChanged.Fire(new_data);
    });
  }
}
