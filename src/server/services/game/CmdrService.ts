import { OnInit, Service } from "@flamework/core";
import { Cmdr } from "@rbxts/cmdr";
import Log from "@rbxts/log";
import { $instance } from "rbxts-transformer-fs";

@Service({})
export class CmdrService implements OnInit {
  private logger = Log.ForContext(CmdrService);

  /** @hidden */
  public onInit() {
    this.logger.Info("Initializing Cmdr");

    // messy initialization
    Cmdr.RegisterDefaultCommands();
    Cmdr.RegisterCommandsIn($instance("src/shared/cmdr/cmds"));
    Cmdr.RegisterHooksIn($instance("src/shared/cmdr/hooks"));
    Cmdr.RegisterTypesIn($instance("src/shared/cmdr/types"));
  }
}
