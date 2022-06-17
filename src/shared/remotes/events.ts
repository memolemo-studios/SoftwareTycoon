import { Networking } from "@flamework/networking";

interface ServerEvents {}

interface ClientEvents {}

/**
 * All events in the game
 */
export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
