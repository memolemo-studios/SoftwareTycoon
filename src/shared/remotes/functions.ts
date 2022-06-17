import { Networking } from "@flamework/networking";

interface ServerFunctions {}

interface ClientFunctions {}

/**
 * All remote functions in the game.
 */
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
