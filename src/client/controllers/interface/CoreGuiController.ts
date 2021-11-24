import { Controller, OnInit } from "@flamework/core";
import Log from "@rbxts/log";
import coreCall from "client/utils/coreCall";
import { GameFlags } from "shared/flags";

// No need to disable the entire CoreGui because it is already
// disabled from the game loader in ReplicatedFirst

/** CoreGuiController is a controller handles CoreGui stuff to the client */
@Controller({})
export class CoreGuiController implements OnInit {
  private logger = Log.ForContext(CoreGuiController);

  /** @hidden */
  public onInit() {
    if (GameFlags.DisableCoreGuiOnStart) {
      this.disableEntireCoreGui();
    }
  }

  /** Disables the entire CoreGui */
  public disableEntireCoreGui() {
    this.logger.Debug("Disabling the entire CoreGui elements");
    this.setCoreGuiType(Enum.CoreGuiType.All, false);
    this.setCore("TopbarEnabled", false);
  }

  /** Sets a boolean any type of CoreGui enabled */
  public setCoreGuiType(coreGuiType: Enum.CoreGuiType, enabled: boolean) {
    this.logger.Debug("{KindBool} {CoreGuiType} type", enabled ? "Enabling" : "Disabling", coreGuiType);
    coreCall("SetCoreGuiEnabled", coreGuiType, enabled);
  }

  /** Sets any kind of options depending on the type parameter */
  public setCore<T extends keyof SettableCores>(parameter: T, options: SettableCores[T]) {
    coreCall("SetCore", parameter, options);
  }

  /** Enables the entire CoreGui */
  public enableEntireCoreGui() {
    this.logger.Debug("Enabling the entire CoreGui elements");
    this.setCoreGuiType(Enum.CoreGuiType.All, true);
    this.setCore("TopbarEnabled", true);
  }
}
