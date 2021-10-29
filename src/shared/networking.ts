import { Networking } from "@flamework/networking";
import { ResultSer } from "@memolemo-studios/result-option-ser";
import { LatencyRequestSerializedError } from "types/errors/latency";
import { LotRequestSerializedError } from "types/errors/lotRequest";
import { PlayerDataSerializedError } from "types/errors/playerdata";
import { PlayerData } from "types/player/data";

// Client -> Server events
interface ServerEvents {
	/**
	 * Recieves back ping request data to the server
	 * @param uuid Unique identifier to each player to prevent unexpected exploits
	 */
	recievePingEvent(uuid: string): void;
}

// Server -> Client events
interface ClientEvents {
	/**
	 * Sends a ping request data to the client
	 * @param uuid Unique generated identifier to each player to prevent unexpected exploits
	 * @param fireTickTime Tick time when it fires during firing that event. `(os.clock)`
	 */
	sendPingEvent(uuid: string, fireTickTime: number): void;
}

/** Global events for the game */
export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();

////-------------------------------////

// Client -> Server functions
interface ServerFunctions {
	/** Fetches player's data */
	fetchPlayerData(): ResultSer.Serialized<PlayerData, PlayerDataSerializedError>;

	/** Request a lot to claim to. */
	requestLot(): ResultSer.Serialized<string, LotRequestSerializedError>;

	/**
	 * Gets any player's latency in miliseconds
	 * @param player Any player to get their latency (must be UserId)
	 * @returns Ping time in miliseconds
	 */
	getPlayerLatency(player: number): ResultSer.Serialized<number, LatencyRequestSerializedError>;
}

// Server -> Client functions
interface ClientFunctions {}

/** Global functions for the game */
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
