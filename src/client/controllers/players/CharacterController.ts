import { Controller, Flamework, OnInit } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players, Workspace } from "@rbxts/services";
import { promiseForCharacter } from "shared/utils/character";
import { FlameworkUtil } from "shared/utils/flamework";
import { BaseCharacterModel } from "types/roblox";

/** Hook into the OnCharacterSpawned */
export interface OnCharacterSpawned {
  /**
   * This function will be called whenever the character spawned (seriously spawned)
   *
   * This should only be used to setup if you want to do something
   * to the character after the character spawned fully.
   */
  onCharacterSpawned(character: BaseCharacterModel): void;
}

/** Hook into the OnCharacterDied */
export interface OnCharacterDied {
  /**
   * This function will be called whenever the character died
   *
   * This should only be used to setup if you want to do something
   * to the character after it is dead.
   */
  onCharacterDied(character: BaseCharacterModel): void;
}

const local_player = Players.LocalPlayer;

@Controller({})
export class CharacterController implements OnInit {
  private logger = Log.ForContext(CharacterController);

  private connectedSpawns = new Map<string, OnCharacterSpawned>();
  private connectedDied = new Map<string, OnCharacterDied>();

  /** Gets the current player's character */
  public getCurrentCharacter(): Option<BaseCharacterModel> {
    return this.isCharacterSpawned() ? Option.wrap(local_player.Character as BaseCharacterModel) : Option.none();
  }

  private async onCharacterAdded(raw: Model) {
    // wait for the character to load like
    // base character model tree
    const character = await promiseForCharacter(raw);
    this.logger.Info("Character spawned successfully");

    for (const [, singleton] of this.connectedSpawns) {
      task.spawn(() => singleton.onCharacterSpawned(character));
    }

    // monitoring for death
    // eslint-disable-next-line prefer-const
    let connection: RBXScriptConnection | undefined;

    const on_character_died = () => {
      this.logger.Info("Character died");
      connection!.Disconnect();

      for (const [, singleton] of this.connectedDied) {
        task.spawn(() => singleton.onCharacterDied(character));
      }
    };

    // eslint-disable-next-line prefer-const
    connection = character.Humanoid.Died.Connect(on_character_died);

    // if the humanoid did died then do the same action as connector
    if (character.Humanoid.Health <= 0) {
      on_character_died();
    }
  }

  /** Helper method returns if the player did spawned */
  public isCharacterSpawned() {
    return (
      local_player.Character !== undefined &&
      local_player.Parent !== undefined &&
      local_player.IsDescendantOf(Workspace)
    );
  }

  /** @hidden */
  public onInit() {
    // connecting flamework singletons that implements
    // both 'OnCharacterSpawned' and 'OnCharacterDied'
    this.connectedSpawns = FlameworkUtil.getDependencySingletons(ctor =>
      Flamework.implements<OnCharacterSpawned>(ctor),
    );
    this.connectedDied = FlameworkUtil.getDependencySingletons(ctor => Flamework.implements<OnCharacterDied>(ctor));

    // character spawn detection
    local_player.CharacterAdded.Connect(c => this.onCharacterAdded(c));
    if (this.isCharacterSpawned()) {
      task.spawn(() => this.onCharacterAdded(local_player.Character!));
    }
  }
}
