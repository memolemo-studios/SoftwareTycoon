import { Flamework, OnInit, OnStart, Reflect, Service } from "@flamework/core";
import { ResultSer } from "@memolemo-studios/result-option-ser";
import Log from "@rbxts/log";
import { Option, Result } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { Functions } from "server/networking";
import { PlayerDataError } from "shared/errors/playerdata";
import { PlayerDataErrorKind } from "types/errors/playerdata";
import { PlayerDataProfile } from "types/player/data";
import { DataService } from "./DataService";

/** Hook into the OnPlayerJoined event */
export interface OnPlayerJoined {
	/**
	 * This function will be called whenever the player joins the game.
	 *
	 * This should only be used to setup if you want to grab player's data
	 * instead of waiting player's data to be loaded from ProfileService.
	 */
	onPlayerJoined(player: Player, profile: PlayerDataProfile): void;
}

/** PlayerService handles player stuff */
@Service({})
export class PlayerService implements OnInit, OnStart {
	private logger = Log.ForContext(PlayerService);
	private onPlayerJoinObjs = new Map<string, OnPlayerJoined>();
	private playerProfiles = new Map<Player, PlayerDataProfile>();

	private fireOnPlayerJoin(player: Player, profile: PlayerDataProfile) {
		for (const [_, obj] of this.onPlayerJoinObjs) {
			task.spawn(() => obj.onPlayerJoined(player, profile));
		}
	}

	private onPlayerRemoving(player: Player) {
		this.logger.Info("{Player} left the game", player.UserId);
		this.playerProfiles.get(player)?.Release();
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
		const profile = result.unwrap();
		this.playerProfiles.set(player, profile);
		this.fireOnPlayerJoin(player, profile);
	}

	public constructor(private dataService: DataService) {}

	/** @hidden */
	public onInit() {
		// connecting connected OnPlayerJoined and OnPlayerLeft implemented objects
		for (const [id, obj] of Reflect.idToObj) {
			if (Flamework.implements<OnPlayerJoined>(obj)) {
				this.onPlayerJoinObjs.set(id, obj);
			}
		}

		// connecting some functions
		Functions.fetchPlayerData.setCallback(player => {
			const profile = this.getProfileFromPlayer(player);
			if (profile.isNone()) {
				return ResultSer.serialize(PlayerDataError.makeResult(PlayerDataErrorKind.ProfileNotLoaded));
			}
			return ResultSer.serialize(Result.ok(profile.unwrap().Data));
		});

		// connecting Player service events
		Players.PlayerAdded.Connect(player => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect(player => this.onPlayerRemoving(player));
	}

	/** Gets PlayerDataProfile from the player */
	public getProfileFromPlayer(player: Player) {
		return Option.wrap(this.playerProfiles.get(player));
	}

	/** @hidden */
	public onStart() {
		// initializing players who joined before Flamework starts
		for (const player of Players.GetPlayers()) {
			task.spawn(() => this.onPlayerAdded(player));
		}
	}
}
