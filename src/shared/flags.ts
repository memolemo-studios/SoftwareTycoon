import { LogLevel } from "@rbxts/log";
import { $NODE_ENV } from "rbxts-transform-env";
import { AppState } from "types/store/appState";
import FlagManager from "./classes/flags";
import { RobloxUtil } from "./utils/roblox";

/** Types for GameFlags */
export interface GameFlags {
  CacheExpiryThreshold: number;
  CameraDebugMode: boolean;
  CircleImage: string;
  CircleOutlineImage: string;
  DisableCoreGuiOnStart: boolean;
  DefaultCharacterWalkSpeed: number;
  DefaultCharacterJumpPower: number;
  DevMinLogLevel: LogLevel;
  EnablePlayerLatency: boolean;
  GhostInvisibleUI: boolean;
  GhostInvisibleUITransparency: number;
  InitialRoduxAppState: AppState;
  InterfaceSpringProps: {
    frequency: number;
    dampingRatio: number;
  };
  LatencyCheckInterval: number;
  NodeEnvironment: string;
  PlayerProfileStoreName: string;
  PlayerDataKeyPrefix: string;
  PlayerDataKeySuffix: string;
  PlayerDataVersion: number;
  ProdMinLogLevel: LogLevel;
  ProjectName: string;
  GroupRankMinIdPermittedThreshold: number;
  RequestLotOnStart: boolean;
  ShadowImage: string;
  UseMockStore: boolean;
}

/** Types for PlacementFlags */
export interface PlacementFlags {
  GridSize: number;
}

/**
 * Placement flags is the same thing basic stuff as GameFlags
 * but it is for the placement system
 */
export const PlacementFlags = new FlagManager<PlacementFlags>({
  GridSize: 4,
});

/**
 * Game flags is a game debugging configuration that
 * it allows to mainpulate values to change the behavior
 * of the game.
 *
 * It is a little bit same as ROBLOX's FFlag feature
 *
 * **NOTE**: Make sure all of the config entries for correct
 * once the game is published to production.
 */
export const GameFlags = new FlagManager<GameFlags>({
  CacheExpiryThreshold: 5,
  CameraDebugMode: true,
  CircleImage: RobloxUtil.assetUrlWithId(602504628),
  CircleOutlineImage: RobloxUtil.assetUrlWithId(6772221049),
  DisableCoreGuiOnStart: true,
  DefaultCharacterJumpPower: 56,
  DefaultCharacterWalkSpeed: 16,
  DevMinLogLevel: LogLevel.Verbose,
  EnablePlayerLatency: false,
  GhostInvisibleUI: false,
  GhostInvisibleUITransparency: 0.9,
  GroupRankMinIdPermittedThreshold: 254,
  InitialRoduxAppState: AppState.Loading,
  InterfaceSpringProps: {
    dampingRatio: 1,
    frequency: 5,
  },
  LatencyCheckInterval: 3,
  NodeEnvironment: $NODE_ENV,
  PlayerProfileStoreName: "PlayerData",
  PlayerDataKeyPrefix: "player-",
  PlayerDataKeySuffix: "",
  PlayerDataVersion: 1,
  ProdMinLogLevel: LogLevel.Information,
  ProjectName: "Software Tycoon",
  RequestLotOnStart: false,
  ShadowImage: RobloxUtil.assetUrlWithId(6486382942),
  UseMockStore: true,
});
