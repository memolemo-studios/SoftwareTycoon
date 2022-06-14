import { Profile } from "@rbxts/profileservice/globals";

/**
 * This type contains player's data. It can be on server
 * or client.
 */
export interface PlayerData {}

/**
 * Type alias for `Profile<PlayerData>`
 */
export type DataProfile = Profile<PlayerData>;
