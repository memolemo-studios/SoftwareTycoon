import { $json } from "rbxts-transformer-fs";

export type GameAssets = {
	interface: {
		shadow: number;
	};
};

export interface AudioAssets {
	button_click: number;
}

const image_assets = $json<GameAssets>("src/shared/images.json");
const audio_assets = $json<AudioAssets>("src/shared/sounds.json");

export namespace AssetProvider {
	export function getAllImages(): Readonly<GameAssets> {
		return image_assets;
	}

	export function getAllSounds(): Readonly<AudioAssets> {
		return audio_assets;
	}
}
