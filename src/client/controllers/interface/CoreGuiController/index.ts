import { Controller } from "@flamework/core";
import coreCall from "./coreCall";

// No need to disable the entire CoreGui because it is already
// disabled from the game loader in ReplicatedFirst

@Controller({})
export class CoreGuiController {
	public disableEntireCoreGui() {
		this.setCoreGuiType(Enum.CoreGuiType.All, false);
		this.setCore("TopbarEnabled", false);
	}

	public setCoreGuiType(coreGuiType: Enum.CoreGuiType, enabled: boolean) {
		coreCall("SetCoreGuiEnabled", coreGuiType, enabled);
	}

	public setCore<T extends keyof SettableCores>(parameter: T, options: SettableCores[T]) {
		coreCall("SetCore", parameter, options);
	}

	public enableEntireCoreGui() {
		this.setCoreGuiType(Enum.CoreGuiType.All, true);
		this.setCore("TopbarEnabled", true);
	}
}
