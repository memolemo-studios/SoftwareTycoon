import { RemoteResponse } from "types/response";

export interface LotModel extends Model {
  Primary: BasePart;
  Canvas: BasePart;
  Spawn: SpawnLocation;
}

export interface LotAttributes {
  ComponentId?: string;
  Owner?: number;
}

export type LotRequestResponse<T> = RemoteResponse<T, LotErrors>;

export const enum LotErrors {
  LotOwned = 1,
  PlayerOwned = 2,
  NoLots = 3,
  InvalidLot = 4,
  ClearOwnership = 5,
}
