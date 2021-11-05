import { Controller, Flamework, OnInit, Reflect } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import CharacterUtil from "shared/util/character";
import { promiseForCharacter } from "shared/util/roblox";
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

	private connectedSpawned = new Map<string, OnCharacterSpawned>();
	private connectedrDied = new Map<string, OnCharacterDied>();

	private currentCharacter?: BaseCharacterModel;

	private fireOnCharacterSpawned(character: BaseCharacterModel) {
		this.connectedSpawned.forEach(c => task.spawn(() => c.onCharacterSpawned(character)));
	}

	private fireOnCharacterDied(character: BaseCharacterModel) {
		this.connectedrDied.forEach(c => task.spawn(() => c.onCharacterDied(character)));
	}

	/**
	 * Returns a boolean as a result of is character spawned in Workspace.
	 */
	public isCharacterSpawned() {
		return local_player.Character !== undefined && local_player.Character.Parent !== undefined;
	}

	/**
	 * Gets the player's character based on the currentCharacter
	 * saved in this service.
	 */
	public getCurrentCharacter() {
		return Option.wrap(local_player.Character as BaseCharacterModel);
	}

	private async onCharacterAdded(raw: Model) {
		// wait for character to load like BaseCharacter model tree
		const character = await promiseForCharacter(raw);
		this.logger.Info("Character spawned successfully");

		this.fireOnCharacterSpawned(character);

		// do something during their death
		let conn: RBXScriptConnection;

		// eslint-disable-next-line prefer-const
		conn = CharacterUtil.watchToDie(character, () => {
			this.logger.Info("Character died");

			conn.Disconnect();
			this.fireOnCharacterDied(character);
		});
	}

	/** @hidden */
	public onInit() {
		// connecting flamework objects that implements `OnCharacterSpawned` and `OnCharacterDied`
		for (const [id, obj] of Reflect.idToObj) {
			if (Flamework.implements<OnCharacterSpawned>(obj)) {
				this.connectedSpawned.set(id, obj);
			}
			if (Flamework.implements<OnCharacterDied>(obj)) {
				this.connectedrDied.set(id, obj);
			}
		}

		// connecting this real guy :)
		local_player.CharacterAdded.Connect(r => this.onCharacterAdded(r));
		if (this.isCharacterSpawned()) {
			task.spawn(() => this.onCharacterAdded(local_player.Character!));
		}
	}
}
