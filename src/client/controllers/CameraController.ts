import { Controller } from "@flamework/core";
import { Option } from "@rbxts/rust-classes";
import { Workspace } from "@rbxts/services";
import BaseScriptableCamera from "client/cameras/base";
import { BaseCharacterModel } from "types/roblox";
import { OnCharacterDied, OnCharacterSpawned } from "./CharacterController";

@Controller({})
export class CameraController implements OnCharacterSpawned, OnCharacterDied {
	private currentSession?: BaseScriptableCamera;

	/**
	 * Gets the current camera
	 * @returns Option
	 */
	public getCamera() {
		return Option.wrap(Workspace.CurrentCamera);
	}

	public onCharacterDied(character: BaseCharacterModel) {}

	public onCharacterSpawned(character: BaseCharacterModel) {}
}
