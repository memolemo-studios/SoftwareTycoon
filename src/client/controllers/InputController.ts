import { Controller, Dependency } from "@flamework/core";
import Log from "@rbxts/log";
import { BaseCharacterModel } from "types/roblox";
import { CharacterController, OnCharacterSpawned } from "./CharacterController";

let isCharMovementEnabled = true;

/**
 * InputController is a controller responsible for manging input things
 * and mainpulate character's controls
 */
@Controller({})
export class InputController implements OnCharacterSpawned {
	private logger = Log.ForContext(InputController);

	public constructor() {}

	private updateCharacter(character: BaseCharacterModel) {
		// base values
		const walk_speed = isCharMovementEnabled ? 16 : 0;
		const jump_power = isCharMovementEnabled ? 56 : 0;

		// setting properties
		character.Humanoid.WalkSpeed = walk_speed;
		character.Humanoid.JumpPower = jump_power;
	}

	/**
	 * Toggles the character movement enabled
	 * @param enabled Boolean to set to
	 */
	public toggleCharacterMovement(enabled: boolean) {
		isCharMovementEnabled = enabled;
		this.logger.Info(`${enabled ? "Enabling" : "Disabling"} character movement`);

		// if the character already spawns, then it will update the character
		const character_opt = Dependency<CharacterController>().getCurrentCharacter();
		if (character_opt.isSome()) {
			this.updateCharacter(character_opt.unwrap());
		}
	}

	/** @hidden */
	public onCharacterSpawned(character: BaseCharacterModel) {
		this.updateCharacter(character);
	}
}
