import Net from "@rbxts/net";
import { LocalStorageErrors } from "types/localStorage";
import { RemoteResponse } from "types/response";

const { Definitions: Def, Middleware: Mid } = Net;

/** Remotes for LocalStorage */
const LocalStorageRemotes = Def.Create({
  /**
   * A server => client event where it handles changes
   * to the player's storage container.
   */
  OnChangedContainer:
    Def.ServerToClientEvent<[keyof PlayerLocalStorage, PlayerLocalStorage[keyof PlayerLocalStorage]]>(),

  /** Tries to get the current storage container for the player */
  RequestContainer:
    Def.ServerAsyncFunction<
      <T extends keyof PlayerLocalStorage>(
        container: keyof PlayerLocalStorage,
      ) => RemoteResponse<PlayerLocalStorage[T], LocalStorageErrors>
    >(),
});

export default LocalStorageRemotes;
