import { Controller, OnInit } from "@flamework/core";
import Log, { LogLevel } from "@rbxts/log";
import LocalStorageRemotes from "shared/remotes/localstorageRemotes";
import { LocalStorageErrors } from "types/localStorage";

const error_msg = "Failed to fetch ({StorageName}) container data. Reason: {Reason}";

@Controller({})
export class LocalStorageController implements OnInit {
  private logger = Log.ForContext(LocalStorageController);

  private onChangedContainer = LocalStorageRemotes.Client.Get("OnChangedContainer");
  private requestContainer = LocalStorageRemotes.Client.Get("RequestContainer");

  private storageCache = new Map<keyof PlayerLocalStorage, PlayerLocalStorage[keyof PlayerLocalStorage]>();

  /**
   * Translates from LocalStorageError related enums
   * to a meaningful messages
   */
  public enumErrorsToMessage(error_enum: LocalStorageErrors) {
    switch (error_enum) {
      case LocalStorageErrors.InvalidContainer:
        return "{Container} is an invalid container!";
      case LocalStorageErrors.PlayerContainerNotFound:
        return "The player's container ({Container}) data is not initialized yet";
      default:
        return "Unknown error!";
    }
  }

  /**
   * Attempts to get storage container
   *
   * **NOTE**: Some containers do not load automatically, so it requires
   * to fetch it from the server, unless 'useFetch' parameter is enabled.
   */
  public getContainer<T extends keyof PlayerLocalStorage>(container: T, useFetch?: boolean) {
    return new Promise<PlayerLocalStorage[T]>((resolve, reject) => {
      // getting it from the cache
      const from_cache = this.storageCache.get(container);
      if (from_cache !== undefined && useFetch !== true) {
        return resolve(from_cache);
      }

      // fetch da data!
      this.logger.Debug("Attempting to fetch ({StorageName}) container data", container);
      this.requestContainer
        .CallServerAsync(container)
        .then(res => {
          if (res.success) {
            resolve(container);
          } else {
            // prettier-ignore
            const msg = this.logger.Write(
							LogLevel.Information,
							this.enumErrorsToMessage(res.reason),
							container
						);
            this.logger.Error(error_msg, msg);
            reject(msg);
          }
        })
        .catch(reason => {
          this.logger.Error(error_msg, reason);
          reject(reason);
        });
    });
  }

  /** Captures any changes to the storage container */
  public onContainerChanged<T extends keyof PlayerLocalStorage>(
    container: T,
    callback: (data: PlayerLocalStorage[T]) => void,
  ) {
    let connection: RBXScriptConnection;
    // eslint-disable-next-line prefer-const
    connection = this.onChangedContainer.Connect((name, data) => {
      if (name === container) {
        callback(data);
      }
    });
    return connection;
  }

  /** @hidden */
  public onInit() {
    this.onChangedContainer.Connect((name, data) => {
      // warn the logger
      this.logger.Info("Storage container changed ({StorageName}) from the server", name);

      // override it again :)
      this.storageCache.set(name, data);
    });
  }
}
