import { Dependency } from "@flamework/core";
import { CommandDefinition } from "@rbxts/cmdr";
import type { AppController } from "client/controllers/interface/AppController";

export = identity<CommandDefinition>({
  Name: "unmountapp",
  Aliases: [],
  Description: "Tries to unmount any app from the AppController",
  Group: "Admin",
  Args: [
    {
      Type: "string",
      Name: "App",
      Description: "An application id to unmount the app. It must be a valid Flamework id",
    },
  ],
  AutoExec: [],
  ClientRun: (_, id) => {
    const result = Dependency<AppController>().unmountApp(id as string);
    if (result.isErr()) {
      return `ERROR: ${result.unwrapErr()}`;
    }
    return "Successfully unmounted app (%s)".format(id as string);
  },
});
