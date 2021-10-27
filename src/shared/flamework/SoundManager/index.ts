import { Controller, Dependency, Service } from "@flamework/core";
import { Option, Result } from "@rbxts/rust-classes";
import { RunService } from "@rbxts/services";
import { AssetProvider, AudioAssets } from "shared/classes/assetProvider";
import { SoundManagerError } from "./error";
import { SoundFile } from "./file";

const audio_assets = AssetProvider.getAllSounds();
let internal_mock: SoundManager;

/** Gets the mock or live version of SoundManager */
export const GetSoundManager = () => {
	if (RunService.IsRunning()) {
		return Dependency<SoundManager>();
	}
	return internal_mock ?? (internal_mock = new SoundManager());
};

@Service({})
@Controller({})
export class SoundManager {
	private files = new Map<string, SoundFile>();

	public cleanupFiles() {
		if (RunService.IsRunning()) {
			throw "YOO, YOU SHOULDN'T DO THIS WTH?";
		}
		this.files.forEach(file => file.destroy());
	}

	public getSoundFileFromId(id: keyof AudioAssets): Option<SoundFile>;
	public getSoundFileFromId(id: string): Option<SoundFile>;
	public getSoundFileFromId(id: string) {
		return Option.wrap(this.files.get(id));
	}

	public destroySoundFile(id: keyof AudioAssets): void;
	public destroySoundFile(id: string): void;
	public destroySoundFile(id: string) {
		this.files.get(id)?.destroy();
		this.files.delete(id);
	}

	public playSoundFileImmediately(
		id: keyof AudioAssets,
		assetId?: undefined,
		destroyAfterwards?: boolean,
	): Result<true, SoundManagerError>;
	public playSoundFileImmediately(
		id: string,
		assetId: number,
		destroyAfterwards?: boolean,
	): Result<true, SoundManagerError>;
	public playSoundFileImmediately(
		id: string,
		assetId?: number,
		destroyAfterwards?: boolean,
	): Result<true, SoundManagerError> {
		return this.createSoundFile(id, assetId!).andWith(file => {
			file.play();
			if (destroyAfterwards) this.destroySoundFile(id);
			return Result.ok(true);
		});
	}

	public createSoundFile(id: keyof AudioAssets): Result<SoundFile, SoundManagerError>;
	public createSoundFile(id: string, assetId: number): Result<SoundFile, SoundManagerError>;
	public createSoundFile(id: string, assetId?: number): Result<SoundFile, SoundManagerError> {
		// override existing sound file
		return this.getSoundFileFromId(id).match(
			file => Result.ok(file),
			() => {
				// attempting to find assetId based on provided audio assets
				assetId = assetId ?? audio_assets[id as keyof typeof audio_assets];
				if (assetId === undefined) {
					return Result.err(new SoundManagerError(id));
				}
				const newFile = new SoundFile(assetId);
				this.files.set(id, newFile);
				return Result.ok(newFile);
			},
		);
	}
}
