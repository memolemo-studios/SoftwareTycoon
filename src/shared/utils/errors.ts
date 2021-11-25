import { LotErrors } from "types/game/lot";

/** Converts `LotErrors` enum to a meaningful messages that can be used for UI or logging */
export function lotErrorToString(errorKind: LotErrors) {
  switch (errorKind) {
    case LotErrors.LotOwned:
      return "This lot is already owned.";
    case LotErrors.NoLots:
      return "There are no lots available.";
    case LotErrors.PlayerOwned:
      return "You're already owned this lot";
    case LotErrors.InvalidLot:
      return "The lot you requested is invalid";
    default:
      return "Unknown error";
  }
}
