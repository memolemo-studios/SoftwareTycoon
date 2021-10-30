import { Controller, Flamework, OnInit, Reflect } from "@flamework/core";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
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

const local_player = Players.LocalPlayer;

@Controller({})
export class CharacterController implements OnInit {
	private connectedCharacterSpawned = new Map<string, OnCharacterSpawned>();
	private currentCharacter?: BaseCharacterModel;

	private fireOnCharacterSpawned(character: BaseCharacterModel) {
		this.connectedCharacterSpawned.forEach(c => task.spawn(() => c.onCharacterSpawned(character)));
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
		return Option.wrap(this.currentCharacter?.Parent !== undefined ? this.currentCharacter : undefined);
	}

	private async onCharacterAdded(raw: Model) {
		// wait for character to load like BaseCharacter model tree
		const character = await promiseForCharacter(raw);
		this.fireOnCharacterSpawned(character);
	}

	/** @hidden */
	public onInit() {
		// connecting flamework objects that implements `OnCharacterSpawned`
		for (const [id, obj] of Reflect.idToObj) {
			if (Flamework.implements<OnCharacterSpawned>(obj)) {
				this.connectedCharacterSpawned.set(id, obj);
			}
		}

		// connecting this real guy :)
		local_player.CharacterAdded.Connect(r => this.onCharacterAdded(r));
		if (this.isCharacterSpawned()) {
			task.spawn(() => this.onCharacterAdded(local_player.Character!));
		}
	}
}
