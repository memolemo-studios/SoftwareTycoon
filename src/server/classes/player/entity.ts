import { Janitor } from "@rbxts/janitor";
import { PlayerData, PlayerDataProfile } from "shared/data/types";

export default class PlayerEntity {
	public readonly data: PlayerData;

	public constructor(
		public readonly instance: Player,
		private readonly janitor: Janitor,
		private readonly profile: PlayerDataProfile,
	) {
		this.data = this.profile.Data;
	}

	public destroy() {
		this.janitor.Destroy();
	}
}
