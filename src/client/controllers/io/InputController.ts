import { Controller, Dependency } from "@flamework/core";
import Log from "@rbxts/log";
import { Players, StarterPlayer } from "@rbxts/services";
import { GameFlags } from "shared/flags";
import { BaseCharacterModel } from "types/roblox";
import { CharacterController, OnCharacterSpawned } from "../player/CharacterController";

const MAX_CAM_ZOOM = StarterPlayer.CameraMaxZoomDistance;
const MIN_CAM_ZOOM = StarterPlayer.CameraMinZoomDistance;
const local_player = Players.LocalPlayer;

@Controller({})
export class InputController implements OnCharacterSpawned {
  private logger = Log.ForContext(InputController);
  private areInputsEnabled = true;

  private updateCharacter(character: BaseCharacterModel) {
    this.logger.Info("Updating inputs to the character and zoom");

    // base values
    const walk_speed = this.areInputsEnabled ? GameFlags.DefaultCharacterWalkSpeed : 0;
    const jump_power = this.areInputsEnabled ? GameFlags.DefaultCharacterJumpPower : 0;

    // disable ability to zoom, and i set it to 20 to avoid being
    // the camera being in first person mode
    local_player.CameraMaxZoomDistance = this.areInputsEnabled ? MAX_CAM_ZOOM : 20;
    local_player.CameraMinZoomDistance = this.areInputsEnabled ? MIN_CAM_ZOOM : 20;

    // setting properties
    const humanoid = character.WaitForChild("Humanoid");
    if (humanoid !== undefined && humanoid.IsA("Humanoid")) {
      humanoid.WalkSpeed = walk_speed;
      humanoid.JumpPower = jump_power;
    }
  }

  /**
   * Toggles the character movement enabled
   * @param enabled Boolean to set to
   */
  public toggleCharacterMovement(enabled: boolean) {
    this.areInputsEnabled = enabled;
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
