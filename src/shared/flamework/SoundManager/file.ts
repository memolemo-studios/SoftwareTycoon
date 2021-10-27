import { Janitor } from "@rbxts/janitor";
import { RunService, SoundService, Workspace } from "@rbxts/services";
import { rbxAssetUrlWithId } from "shared/util/roblox";

// FIXME: Don't know what to do with this...
export class SoundFile {
	private janitor = new Janitor();
	public readonly instance: Sound;

	public constructor(id: number) {
		this.instance = new Instance("Sound");
		this.instance.SoundId = rbxAssetUrlWithId(id);
		this.instance.Parent = RunService.IsRunning() ? SoundService : Workspace;
		this.janitor.Add(this.instance);
	}

	public play() {
		this.instance.Play();
		task.delay(this.instance.TimeLength, () => {
			this.instance.Stop();
		});
	}

	public destroy() {
		this.janitor.Destroy();
	}
}
