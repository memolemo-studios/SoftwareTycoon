import { Controller, Dependency } from "@flamework/core";
import Log from "@rbxts/log";
import { Players, StarterPlayer } from "@rbxts/services";
import { BaseCharacterModel } from "types/roblox";
import { CharacterController, OnCharacterSpawned } from "./CharacterController";

const MAX_CAM_ZOOM = StarterPlayer.CameraMaxZoomDistance;
const MIN_CAM_ZOOM = StarterPlayer.CameraMinZoomDistance;
const local_player = Players.LocalPlayer;

let is_movement_enabled = true;

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
		const walk_speed = is_movement_enabled ? 16 : 0;
		const jump_power = is_movement_enabled ? 56 : 0;

		// disable ability to zoom, and i set it to 20 to avoid being
		// the camera being in first person mode
		local_player.CameraMaxZoomDistance = is_movement_enabled ? MAX_CAM_ZOOM : 20;
		local_player.CameraMinZoomDistance = is_movement_enabled ? MIN_CAM_ZOOM : 20;

		// setting properties
		character.Humanoid.WalkSpeed = walk_speed;
		character.Humanoid.JumpPower = jump_power;
	}

	/**
	 * Toggles the character movement enabled
	 * @param enabled Boolean to set to
	 */
	public toggleCharacterMovement(enabled: boolean) {
		is_movement_enabled = enabled;
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
