import { Networking } from "@flamework/networking";
import { PlayerData } from "types/player";

interface ServerFunctions {
  RequestPlayerData: () => PlayerData;
}

interface ClientFunctions {}

/**
 * All remote functions in the game.
 */
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
