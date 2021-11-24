import { CommandDefinition } from "@rbxts/cmdr";
import { GameFlags } from "shared/flags";

export = identity<CommandDefinition>({
  Name: "setflag",
  Aliases: [],
  Description: "Sets a game flag to any value desirable",
  Group: "Admin",
  Args: [
    {
      Type: "gameFlag",
      Name: "Flag",
      Description: "A valid flag found in 'GameFlags' module.",
    },
    {
      Type: "defined",
      Name: "Value",
      Description: "A value to set from flag to. (must be defined)",
    },
  ],
  AutoExec: [],
  ClientRun: (_, key, value) => {
    try {
      GameFlags.setEntry(key as keyof GameFlags, value as GameFlags[keyof GameFlags]);
      return "Succesfully set %s flag to %s".format(tostring(key), tostring(value));
    } catch (err) {
      return "Unable to set %s flag: %s".format(tostring(key), tostring(err));
    }
  },
});
