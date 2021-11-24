import { CommandDefinition } from "@rbxts/cmdr";
import { Players } from "@rbxts/services";

export = identity<CommandDefinition>({
  Name: "requestlot",
  Aliases: ["reqlot"],
  Description: "Requests a random vacant lot",
  Group: "Admin",
  Args: [
    {
      Type: "player",
      Name: "Target",
      Description: "The player to claim a random vacant lot. Omit for yourself",
      Default: Players.LocalPlayer,
    },
  ],
  AutoExec: [],
});
