import { Controller, OnInit } from "@flamework/core";
import { CmdrClient } from "@rbxts/cmdr";
import Log from "@rbxts/log";

@Controller({})
export class CmdrController implements OnInit {
  private logger = Log.ForContext(CmdrController);

  /** @hidden */
  public onInit() {
    this.logger.Info("Initializing CmdrClient");
    CmdrClient.SetActivationKeys([Enum.KeyCode.F2]);
  }
}
