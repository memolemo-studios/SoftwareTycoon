import { Flamework, OnInit, OnStart, Reflect, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Players } from "@rbxts/services";
import { DataService } from "./DataService";

/** Hook into the OnPlayerJoined event */
export interface OnPlayerJoined {
	/**
	 * This function will be called whenever the player joins the game.
	 *
	 * This should only be used to setup if you want to grab player's data
	 * instead of waiting player's data to be loaded from ProfileService.
	 */
	onPlayerJoined(player: Player): void;
}

/** Hook into the OnPlayerLeft event */
export interface OnPlayerLeft {
	/**
	 * This function will be called whenever the player left the game.
	 *
	 * There's nothing special about expect making any service clean
	 */
	onPlayerLeft(player: Player): void;
}

/** PlayerService handles player stuff */
@Service({})
export class PlayerService implements OnInit, OnStart {
	private logger = Log.ForContext(PlayerService);

	private onPlayerJoinObjs = new Map<string, OnPlayerJoined>();
	private onPlayerLeftObjs = new Map<string, OnPlayerLeft>();

	private fireOnPlayerJoin(player: Player) {
		for (const [_, obj] of this.onPlayerJoinObjs) {
			task.spawn(() => obj.onPlayerJoined(player));
		}
	}

	private fireOnPlayerLeft(player: Player) {
		for (const [_, obj] of this.onPlayerLeftObjs) {
			task.spawn(() => obj.onPlayerLeft(player));
		}
	}

	private onPlayerRemoving(player: Player) {
		this.logger.Info("{Player} left the game", player.UserId);

		// TODO: clear player's profile
		this.fireOnPlayerLeft(player);
	}

	private async onPlayerAdded(player: Player) {
		this.logger.Info("{Player} joins the game", player.UserId);

		// trying to get player's data
		const result = await this.dataService.loadPlayerProfile(player);
		if (result.isErr()) {
			// TODO: kick the player
			return player.Kick("Your data cannot be loaded");
		}

		// do something with player's profile
		// but not yet though
		this.fireOnPlayerJoin(player);
	}

	public constructor(private dataService: DataService) {}

	/** @hidden */
	public onInit() {
		// connecting connected OnPlayerJoined and OnPlayerLeft implemented objects
		for (const [id, obj] of Reflect.idToObj) {
			if (Flamework.implements<OnPlayerJoined>(obj)) {
				this.onPlayerJoinObjs.set(id, obj);
			}
			if (Flamework.implements<OnPlayerLeft>(obj)) {
				this.onPlayerLeftObjs.set(id, obj);
			}
		}

		// connecting Player service events
		Players.PlayerAdded.Connect(player => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect(player => this.onPlayerRemoving(player));
	}

	/** @hidden */
	public onStart() {
		// initializing players who joined before Flamework starts
		for (const player of Players.GetPlayers()) {
			task.spawn(() => this.onPlayerAdded(player));
		}
	}
}
