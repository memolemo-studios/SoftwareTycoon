import { Dependency } from "@flamework/core";
import { CommandDefinition } from "@rbxts/cmdr";
import type { AppController } from "client/controllers/interface/AppController";

export = identity<CommandDefinition>({
  Name: "mountapp",
  Aliases: [],
  Description: "Tries to mount any app from the AppController",
  Group: "Admin",
  Args: [
    {
      Type: "string",
      Name: "App",
      Description: "An application id to mount the app. It must be a valid Flamework id",
    },
  ],
  AutoExec: [],
  ClientRun: (_, id) => {
    const result = Dependency<AppController>().mountApp(id as string);
    if (result.isErr()) {
      return `ERROR: ${result.unwrapErr()}`;
    }
    return "Successfully mounted %s app".format(id as string);
  },
});
