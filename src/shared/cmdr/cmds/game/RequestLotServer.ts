import { Dependency } from "@flamework/core";
import { CommandContext } from "@rbxts/cmdr";
import type { LotService } from "server/services/game/LotService";
import { lotErrorToString } from "shared/utils/errors";

let lot_service: LotService;

export = (context: CommandContext): string => {
  // reload LotService variable
  if (lot_service === undefined) {
    lot_service = Dependency<LotService>();
  }

  // Tries to request a lot
  const result = lot_service.assignRandomLotToPlayer(context.Executor);
  if (result.isErr()) {
    return `ERROR: ${lotErrorToString(result.unwrapErr())}`;
  }

  // time to spawn the player!
  context.Executor.LoadCharacter();
  return "Successfully claimed a lot!";
};
