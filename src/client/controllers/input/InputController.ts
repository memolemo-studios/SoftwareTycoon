import { Controller } from "@flamework/core";
import Log from "@rbxts/log";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ContextActionService } from "@rbxts/services";
import { CharacterController, OnSpawn } from "../player/CharacterController";

const UNBIND_ACTION_NAME = "InputController::updateCharacter";
const MOVEMENT_CONTROLS = [
  Enum.KeyCode.A,
  Enum.KeyCode.W,
  Enum.KeyCode.S,
  Enum.KeyCode.D,
  Enum.KeyCode.Up,
  Enum.KeyCode.Down,
  Enum.KeyCode.Left,
  Enum.KeyCode.Right,
];

let areInputsEnabled = true;

@Controller({})
export class InputController implements OnSpawn {
  private logger = Log.ForContext(InputController);

  public constructor(private characterController: CharacterController) {}

  private updateCharacter({ HumanoidRootPart: rootPart, Humanoid: humanoid }: CharacterRigR15) {
    this.logger.Verbose("Updating character based on input configuration");

    // Took me a million years, I didn't discover that you can
    // actually temporarily unbind action and bring it back
    //
    // Just to be on the safer side, we'll going to prevent
    // humanoid from moving the character model.
    //
    // Source:
    // https://devforum.roblox.com/t/how-do-you-temporarily-unbindrebind-the-scroll-wheel-from-its-core-zoom-functionality/226354/11
    if (areInputsEnabled) {
      ContextActionService.UnbindAction(UNBIND_ACTION_NAME);
      humanoid.WalkSpeed = 16;
      humanoid.JumpPower = 50;
      rootPart.Anchored = false;
    } else {
      ContextActionService.BindAction(
        UNBIND_ACTION_NAME,
        () => Enum.ContextActionResult.Sink,
        false,
        ...MOVEMENT_CONTROLS,
      );
      humanoid.WalkSpeed = 0;
      humanoid.JumpPower = 0;
      rootPart.Anchored = true;
    }
  }

  /**
   * Sets the character movement enabled to whatever
   * boolean value is applied in a boolean argument.
   *
   * This will take effect if the character already spawned
   * to Workspace or to their next spawn.
   *
   * @param enabled Player can move or not
   */
  public setCharacterMovementEnabled(enabled: boolean) {
    this.logger.Info(`${enabled ? "Enabling" : "Disabling"} character movements`);
    areInputsEnabled = enabled;

    // automatically updates if the character stuff already spawns
    this.characterController.getCharacter().match(
      (character) => this.updateCharacter(character),
      () => {},
    );
  }

  /**
   * Toggles the character movement enabled.
   *
   * If you want to see what will happen then or how it works, please
   * go to `CharacterController::setCharacterMovementEnabled` method.
   */
  public toggleCharacterMovement() {
    this.setCharacterMovementEnabled(!areInputsEnabled);
  }

  /** @hidden */
  public onCharacterSpawn(character: CharacterRigR15): void {
    this.updateCharacter(character);
  }
}
