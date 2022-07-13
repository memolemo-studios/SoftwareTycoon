import { Networking } from "@flamework/networking";
import { LotOwnError } from "shared/definitions/errors/lot";
import { PlayerData } from "types/player";
import { SerializedResult } from "types/serde/rust-classes";

interface ServerFunctions {
  RequestPlayerData: () => PlayerData;

  /**
   * Attempts to request a lot to the server.
   *
   * Please visit `LotService::assignPlayer` for how it works
   * and the predictions of the `Result` value.
   */
  RequestLot: () => SerializedResult<string, LotOwnError>;
}

interface ClientFunctions {}

/**
 * All remote functions in the game.
 */
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
