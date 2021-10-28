import { Dependency } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { AssetManager } from "shared/flamework/AssetManager";
import { SoundManager } from "shared/flamework/SoundManager";

/**
 * Gets required asset services such: `AssetManager` and `SoundManager`
 */
export function getAssetServices() {
	if (RunService.IsRunning()) {
		return {
			SoundManager: Dependency<SoundManager>(),
			AssetManager: Dependency<AssetManager>(),
		};
	}
	return {
		SoundManager: new SoundManager(),
		AssetManager: new AssetManager(),
	};
}

/** Cleans up assets */
export function cleanupAssets() {
	getAssetServices().SoundManager.cleanupFiles();
}
