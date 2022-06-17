import { Controller, OnInit } from "@flamework/core";
import { Signal } from "@rbxts/beacon";
import Log, { Logger } from "@rbxts/log";
import { Players, RunService } from "@rbxts/services";
import { Dictionary } from "@rbxts/sift";
import { Events, Functions } from "client/remotes";
import { KickSeverity, PlayerKickHandler } from "shared/singletons/PlayerKickHandler";
import { PlayerData } from "types/player";

// Because it is a ModuleScript, we cannot guarantee if these variables
// can be changed from the controller (exploiter can change it)
const waitingThreads: thread[] = [];
let CACHE: PlayerData | undefined;
let FAILED_TO_LOAD_DATA = false;

function unpauseWaitingThreads() {
  for (const thread of waitingThreads) {
    task.spawn(() => coroutine.resume(thread));
  }
}

async function requestPlayerData(logger: Logger) {
  Promise.retry(Functions.RequestPlayerData, 3)
    .then((data) => {
      if (RunService.IsStudio()) {
        logger.Debug("Data loaded successfully with value = {@NewData}", data);
      } else {
        logger.Info("Data loaded successfully");
      }
      logger.Verbose("Saving loaded date as cache");
      CACHE = data;
      unpauseWaitingThreads();
    })
    .catch((reason) => {
      FAILED_TO_LOAD_DATA = true;
      logger.Error("Failed to load data from server: {Reason}", reason);
    })
    .await();
}

/**
 * This controller is responsible for gathering player's data
 * from the server.
 *
 * It works by recieving an event when data changes or
 * initially call them when the game starts and store it as a cache.
 *
 * To retrieve client's data, use `PlayerDataController::Get` and it will
 * copy the cache to avoid unexpected mutations.
 */
@Controller({})
export class PlayerDataController implements OnInit {
  private logger = Log.ForContext(PlayerDataController);

  /**
   * This will invoke whenever player's data is changed from server.
   * @param newData New data recieved from the server.
   */
  public readonly OnDataChanged = new Signal<[newData: PlayerData]>();

  public constructor(private playerKickHandler: PlayerKickHandler) {}

  /** @hidden */
  public async onInit() {
    Events.OnDataChanged.connect((newData) => {
      // TODO(memothelemo): Maybe do not show to anyone about their data?
      Log.Verbose("Updated new data: {@NewData}", newData);
      CACHE = newData;
      this.OnDataChanged.fire(Dictionary.copyDeep(newData));
    });

    this.logger.Info("Fetching data from server");
    await requestPlayerData(this.logger);

    // automatically kick the client if the data wasn't
    // able to load it on time
    if (FAILED_TO_LOAD_DATA) {
      this.playerKickHandler.KickSafe(
        Players.LocalPlayer,
        KickSeverity.Bug,
        "Cannot load data from the server",
      );
    }

    // terminate the session, assuming that a promise will
    // never end :)
    coroutine.yield();
  }

  /**
   * Waits for the player's initial data to load.
   *
   * It is an alternative method to `PlayerDataController::Get` because
   * PlayerDataController loads the initial data from the server and cause
   * an error if you call it too early.
   *
   * ## Rejection
   * It will reject this promise if the player data cache
   * is undefined after the thread is resumed.
   *
   * @returns Promise of PlayerData
   */
  public async WaitForData(): Promise<PlayerData> {
    coroutine.yield();
    assert(CACHE, "Cache is undefined");
    return Dictionary.copyDeep(CACHE);
  }

  /**
   * Attempts to get player's data.
   *
   * It is best to use `WaitForData`, if you're trying to get the
   * initial data of the player from the server after Flamework starts
   * because you'll get an error if you tried to get it too early (not loaded
   * at that time).
   *
   * @returns PlayerData or thrown an error
   */
  public Get(): PlayerData {
    if (CACHE === undefined) {
      error("Data is not loaded yet.");
    }
    return Dictionary.copyDeep(CACHE);
  }
}
