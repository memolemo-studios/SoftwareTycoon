import { Controller } from "@flamework/core";
import Log from "@rbxts/log";
import { BaseCharacterModel } from "types/roblox";
import { CharacterController, OnCharacterSpawned } from "./CharacterController";

/**
 * InputController is a controller responsible for manging input things
 * and mainpulate character's controls
 */
@Controller({})
export class InputController implements OnCharacterSpawned {
	private logger = Log.ForContext(InputController);
	private isCharMovementEnabled = true;

	public constructor(private characterController: CharacterController) {}

	private updateCharacter(character: BaseCharacterModel) {
		// base values
		const can_move = this.isCharMovementEnabled;
		const walk_speed = can_move ? 16 : 0;
		const jump_power = can_move ? 56 : 0;

		// setting properties
		character.Humanoid.WalkSpeed = walk_speed;
		character.Humanoid.JumpPower = jump_power;
	}

	/**
	 * Toggles the character movement enabled
	 * @param enabled Boolean to set to
	 */
	public toggleCharacterMovement(enabled: boolean) {
		this.isCharMovementEnabled = enabled;
		this.logger.Info(`${enabled ? "Disabling" : "Enabling"} character movement`);

		// if the character already spawns, then it will update the character
		const character_opt = this.characterController.getCurrentCharacter();
		if (character_opt.isSome()) {
			this.updateCharacter(character_opt.unwrap());
		}
	}

	/** @hidden */
	public onCharacterSpawned(character: BaseCharacterModel) {
		this.updateCharacter(character);
	}
}
