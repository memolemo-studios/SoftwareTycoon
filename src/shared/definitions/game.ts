import { GameFlags } from "shared/flags";

export const DEFAULT_PLAYER_DATA = {};

export const GAME_VERSION = `${GameFlags.NodeEnvironment !== "production" ? "DEV " : ""}${PKG_VERSION}`;
