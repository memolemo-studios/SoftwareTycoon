import { Controller, Service } from "@flamework/core";
import { Bin } from "@rbxts/bin";
import { Option, Result } from "@rbxts/rust-classes";
import { SoundService } from "@rbxts/services";
import { RobloxUtil } from "shared/util/roblox";

export class SoundFile {
	protected bin = new Bin();

	public constructor(public readonly instance: Sound, public readonly parent?: SoundFile) {
		this.bin.add(instance);
		if (parent) {
			parent.bin.add(this);
		}
	}

	/**
	 * Instantiate `SoundFile` from asset id
	 * @param assetId Roblox asset id
	 */
	public static fromAssetId(assetId: number) {
		const sound_asset_id = RobloxUtil.assetUrlWithId(assetId);

		const sound = new Instance("Sound");
		sound.SoundId = sound_asset_id;
		sound.Parent = SoundService;

		return new SoundFile(sound);
	}

	/** Plays the sound, simple... */
	public play() {
		this.instance.Play();
		task.delay(this.instance.TimeLength + 0.1, () => this.instance.Stop());
	}

	/** Clones the sound file */
	public clone(target?: Instance) {
		const cloned_sound = this.instance.Clone();
		cloned_sound.Parent = target ?? SoundService;
		return new SoundFile(cloned_sound);
	}

	/** Destroys sound file and other playing sounds */
	public destroy() {
		this.bin.destroy();
	}
}

@Service({})
@Controller({})
export class SoundManager {
	private files = new Map<string, SoundFile>();

	/**
	 * Cleans up all of the sound files
	 *
	 * **NOTE**: You should not cleanup sound files
	 * unless it is from the temporary runtime like Hoarcekat.
	 */
	public cleanupFiles() {
		this.files.forEach(file => file.destroy());
		this.files.clear();
	}

	/**
	 * Gets the sound file based on the id
	 * @param id Assigned sound id
	 */
	public getSoundFileFromId(id: string) {
		return Option.wrap(this.files.get(id));
	}

	/**
	 * Clears the sound file based on the id and it ignores
	 * it if the sound file doesn't exists
	 * @param id Assigned sound id
	 */
	public deleteSoundFile(id: string) {
		this.files.get(id)?.destroy();
		this.files.delete(id);
	}

	/**
	 * Creates a sound file
	 *
	 * **NOTE**: It will override the existing sound file
	 * @param id Assigned sound id
	 * @param assetId Asset id
	 */
	public createSoundFile(id: string, assetId: number) {
		// override existing sound file
		return this.getSoundFileFromId(id).match(
			file => file,
			() => {
				// creating new sound file
				const file = SoundFile.fromAssetId(assetId);
				this.files.set(id, file);
				return file;
			},
		);
	}
}
