import { Registry } from "@rbxts/cmdr";
import { GameFlags } from "shared/flags";

function isPlayerAuthorized(player: Player) {
  // get the creator id
  const creator_id = game.CreatorId;

  // people would like to own the game as a User or Group
  if (game.CreatorType === Enum.CreatorType.User) {
    return player.UserId === creator_id;
  }

  // get their rank from the group
  const rank = player.GetRankInGroup(creator_id);

  // check for the minimum rank threshold that they can be permitted
  return GameFlags.GroupRankMinIdPermittedThreshold <= rank;
}

export = (registry: Registry) => {
  registry.RegisterHook("BeforeRun", context => {
    if (context.Group === "DefaultAdmin" && isPlayerAuthorized(context.Executor)) {
      return "You don't have permission to run this command";
    }
  });
};
