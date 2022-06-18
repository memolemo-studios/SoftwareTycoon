import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import promiseR15, { CharacterRigR15 } from "@rbxts/promise-character";
import { Option } from "@rbxts/rust-classes";
import { Players, Workspace } from "@rbxts/services";
import { makeListenersSet } from "shared/macros/flamework";

/**
 * Hooks into the `OnSpawn` lifecycle event.
 */
export interface OnSpawn {
  /**
   * This method will return whenever the character spawns however,
   * it doesn't guarantee to load their appearance fully.
   */
  onCharacterSpawn(character: CharacterRigR15): void;
}

/**
 * Hooks into the `OnDied` lifecycle event.
 */
export interface OnDied {
  /**
   * This method will run whenever the character dies.
   */
  onCharacterDied(character: CharacterRigR15): void;
}

const LocalPlayer = Players.LocalPlayer;
let currentCharacter: CharacterRigR15 | undefined;

/**
 * This service is responsible for handling the client's
 * character.
 */
@Controller({})
export class CharacterController implements OnStart {
  private spawnListeners = makeListenersSet<OnSpawn>();
  private diedListeners = makeListenersSet<OnDied>();

  private logger = Log.ForContext(CharacterController);

  private onCharacterDied(character: CharacterRigR15) {
    for (const listener of this.diedListeners) {
      task.spawn(() => listener.onCharacterDied(character));
    }
  }

  private onCharacterAdded(model: Model) {
    this.logger.Verbose("Character spawned, loading the R15 rig model");

    // we're going to cancel the thread if the character for some reason
    // got glitched out of died while loading the character rig.
    const promise = new Promise((resolve, _, onCancel) => {
      const currentThread = coroutine.running();
      onCancel(() => task.cancel(currentThread));

      const character = promiseR15(model).expect();
      currentCharacter = character;

      // character loading is complete
      task.spawn(() => {
        this.logger.Verbose("Loading character done");
        for (const listener of this.spawnListeners) {
          listener.onCharacterSpawn(character);
        }
        const connection = character.Humanoid.Died.Connect(() => {
          this.logger.Verbose("Character died");
          currentCharacter = undefined;
          connection.Disconnect();
          this.onCharacterDied(character);
        });
      });

      resolve(undefined);
    }).catch((reason) => this.logger.Error("Failed to load character: {Reason}", reason));

    const connection = model.GetPropertyChangedSignal("Parent").Connect(() => {
      this.logger.Verbose("Cancelling loading character thread");
      connection.Disconnect();
      promise.cancel();
    });
  }

  /**
   * Gets the current character from the player.
   *
   * **Note**:
   *
   * It will return as `undefined` if the character
   * hasn't loaded yet or died.
   *
   * @returns Option with a character type.
   */
  public getCharacter() {
    return Option.wrap(currentCharacter);
  }

  /**
   * Checks if the player did spawn to the world.
   *
   * **There are factors to be considered the player has spawn to the world:**
   *
   * - `Player.Character` isn't undefined as well as its parent.
   * - Character model must be inside of Workspace service.
   */
  public isCharacterSpawned() {
    return (
      LocalPlayer.Character !== undefined &&
      LocalPlayer.Character.Parent !== undefined &&
      LocalPlayer.Character.IsDescendantOf(Workspace)
    );
  }

  /** @hidden */
  public onStart() {
    LocalPlayer.CharacterAdded.Connect((c) => this.onCharacterAdded(c));
    if (LocalPlayer.Character !== undefined) {
      task.spawn(() => this.onCharacterAdded(LocalPlayer.Character!));
    }
  }
}
