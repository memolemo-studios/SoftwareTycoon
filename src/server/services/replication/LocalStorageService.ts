import { OnInit, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { LocalStorage } from "server/classes/localStorage";
import LocalStorageRemotes from "shared/remotes/localstorageRemotes";
import { PlayerData } from "types/game/data";
import { LocalStorageErrors } from "types/localStorage";
import { RemoteResponse } from "types/response";

declare global {
  interface PlayerLocalStorage {
    PlayerData: PlayerData;
  }
}

@Service({})
export class LocalStorageService implements OnInit {
  private requestContainerRemote = LocalStorageRemotes.Server.Create("RequestContainer");

  private logger = Log.ForContext(LocalStorageService);
  private storages = new Map<string, LocalStorage<keyof PlayerLocalStorage>>();

  /** Gets a storage medium */
  public getLocalStorage<T extends keyof PlayerLocalStorage>(name: T) {
    return Option.wrap(this.storages.get(name));
  }

  /**
   * Adds a new storage medium for every player
   * with an optional default template parameter
   */
  public addLocalStorage<T extends keyof PlayerLocalStorage>(name: T, template?: PlayerLocalStorage[T]) {
    // do not recreate local storage again, get it immediately
    const previous_storage = this.storages.get(name);
    if (previous_storage !== undefined) {
      return previous_storage;
    }

    // creating one!
    const new_storage = new LocalStorage(name, template);
    this.logger.Info("Creating new local storage container ({Name})", name);
    this.storages.set(name, new_storage);
    return new_storage;
  }

  /** @hidden */
  public onInit() {
    this.requestContainerRemote.SetCallback((player, container) => {
      // validating the container
      const local_storage_opt = this.getLocalStorage(container);
      if (local_storage_opt.isNone()) {
        return {
          success: false,
          reason: LocalStorageErrors.InvalidContainer,
        };
      }
      // checking if that player has that container
      return local_storage_opt
        .unwrap()
        .getPlayerContainer(player)
        .match<RemoteResponse<PlayerData, LocalStorageErrors>>(
          data => ({
            success: true,
            value: data,
          }),
          () => ({
            success: false,
            reason: LocalStorageErrors.PlayerContainerNotFound,
          }),
        );
    });
  }
}
