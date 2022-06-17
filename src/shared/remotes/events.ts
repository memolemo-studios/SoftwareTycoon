import { Networking } from "@flamework/networking";
import { PlayerData } from "types/player";

interface ServerEvents {}

interface ClientEvents {
  OnDataChanged: (newData: PlayerData) => void;
}

/**
 * All events in the game
 */
export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
