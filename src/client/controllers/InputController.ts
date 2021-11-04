import { Controller, OnInit } from "@flamework/core";
import Log from "@rbxts/log";
import { Players } from "@rbxts/services";
import { promiseTree } from "@rbxts/validate-tree";
import { KeyboardCoreScript } from "types/roblox";

// TODO: disable character movements using walkspeed

/** InputController is responsible managing input */
@Controller({})
export class InputController implements OnInit {
	private logger = Log.ForContext(InputController);
	private keyboardCoreScript!: KeyboardCoreScript;

	private async getCoreScripts() {
		const local_player = Players.LocalPlayer;
		const player_scripts = local_player.WaitForChild("PlayerScripts");
		return promiseTree(player_scripts, {
			$className: "PlayerScripts",
			PlayerModule: {
				$className: "ModuleScript",
				ControlModule: {
					$className: "ModuleScript",
					Keyboard: "ModuleScript",
				},
			},
		});
	}

	private async reloadKeyboardCoreScript() {
		if (this.keyboardCoreScript === undefined) {
			this.logger.Info("Reloading 'Keyboard' CoreScript module");
			const tree = await this.getCoreScripts();
			this.keyboardCoreScript = require(tree.PlayerModule.ControlModule.Keyboard) as KeyboardCoreScript;
		}
		return this.keyboardCoreScript;
	}

	/** @hidden */
	public onInit() {
		// reload this guy upon Flamework initialization
		this.reloadKeyboardCoreScript();
	}

	/** Disables the movement bindings thus unable to move the character */
	public async disableMovementBindings() {
		this.logger.Info("Unbinding keyboard movement actions");

		await this.reloadKeyboardCoreScript();
		this.keyboardCoreScript.Enable(false);
	}

	/** Enables the movement bindings thus able to move the character */
	public async enableMovementBindings() {
		this.logger.Info("Binding keyboard movement actions");

		await this.reloadKeyboardCoreScript();
		this.keyboardCoreScript.Enable(true);
	}
}
