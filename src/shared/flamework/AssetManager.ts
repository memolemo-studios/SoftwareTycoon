import { Controller, Service } from "@flamework/core";
import { Dictionary } from "@rbxts/llama";
import Object from "@rbxts/object-utils";
import { Option } from "@rbxts/rust-classes";
import { $json } from "rbxts-transformer-fs";

export interface AssetContainer {
	interface: Record<string, number>;
	sounds: Record<string, number>;
}

const collection = $json<AssetContainer>("config/assets.json") as unknown as AssetContainer;

/** Handles asset stuff to the game */
@Service({})
@Controller({})
export class AssetManager {
	/** Gets the asset id from the image asset library */
	public getAssetIdFromSoundName(soundName: string) {
		return Option.wrap(collection.sounds[soundName]);
	}

	/** Gets the asset id from the image asset library */
	public getAssetIdFromImageName(imageName: string) {
		return Option.wrap(collection.sounds[imageName]);
	}

	/**
	 * Gets all of the image assets
	 * @returns Readonly collection
	 */
	public getImageAssets(): Readonly<Record<string, number>> {
		return Dictionary.copy(collection.interface);
	}

	/**
	 * Gets all of the sound assets
	 * @returns Readonly collection
	 */
	public getSoundAssets(): Readonly<Record<string, number>> {
		return Dictionary.copy(collection.sounds);
	}

	/**
	 * Gets all of the asset ids
	 * @returns Number collection
	 */
	public getAssetIds() {
		const asset_ids = new Array<number>();
		for (const id of Object.values(this.getImageAssets())) {
			asset_ids.push(id);
		}
		for (const id of Object.values(this.getSoundAssets())) {
			asset_ids.push(id);
		}
		return asset_ids;
	}
}
