import { Networking } from "@flamework/networking";
import { ResultSer } from "@memolemo-studios/result-option-ser";
import { LotRequestSerializedError } from "types/errors/lotRequest";
import { PlayerDataSerializedError } from "types/errors/playerdata";
import { PlayerData } from "types/player/data";

// Client -> Server events
interface ServerEvents {}

// Server -> Client events
interface ClientEvents {}

/** Global events for the game */
export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();

////-------------------------------////

// Client -> Server functions
interface ServerFunctions {
	/** Fetches player's data */
	fetchPlayerData(): ResultSer.Serialized<PlayerData, PlayerDataSerializedError>;

	/** Request a lot to claim to. */
	requestLot(): ResultSer.Serialized<string, LotRequestSerializedError>;
}

// Server -> Client functions
interface ClientFunctions {}

/** Global functions for the game */
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
