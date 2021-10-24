import { Dependency, Flamework, OnInit, OnStart, Reflect, Service } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import PlayerEntity from "server/classes/player/entity";
import { PlayerDataProfile } from "shared/data/types";
import { PlayerDataErrors } from "shared/types/enums/errors/dataErrors";
import { PlayerDataService } from "../PlayerDataService";
import { PlayerKickService } from "../PlayerKickService";
import { OnPlayerJoined, OnPlayerLeft } from "./decorator";

@Service({})
export class PlayerService implements OnInit, OnStart {
	private logger = Log.ForContext(PlayerService);
	private entityPerPlayer = new Map<Player, PlayerEntity>();

	private dataService = Dependency<PlayerDataService>();
	private kickService = Dependency<PlayerKickService>();

	private connectedOnJoinedObjs = new Map<string, OnPlayerJoined>();
	private connectedOnLeftObjs = new Map<string, OnPlayerLeft>();

	private callConnectedOnLeftObjs(player: Player) {
		this.connectedOnLeftObjs.forEach(v => task.spawn((p: Player) => v.onPlayerLeft(p), player));
	}

	private callConnectedOnJoinObjs(entity: PlayerEntity) {
		this.connectedOnJoinedObjs.forEach(v => task.spawn((e: PlayerEntity) => v.onPlayerJoined(e), entity));
	}

	private loadPlayerWithProfile(player: Player, profile: PlayerDataProfile) {
		const janitor = new Janitor();
		const entity = new PlayerEntity(player, janitor, profile);

		janitor.Add(() => profile.Release());
		this.entityPerPlayer.set(player, entity);
		this.callConnectedOnJoinObjs(entity);
	}

	private onPlayerAdded(player: Player) {
		// load player's profile
		this.logger.Info("{@Player} joined the game", player);
		return this.dataService
			.loadPlayerProfile(player)
			.then(res => {
				if (res.isErr()) {
					// kick the player
					return this.kickService.kickPlayerForError(player, res.unwrapErr());
				}
				this.loadPlayerWithProfile(player, res.unwrap());
			})
			.catch(reason => {
				warn(reason);
				this.kickService.kickPlayerForError(player, PlayerDataErrors.FailedToLoad);
			});
	}

	private onPlayerRemoving(player: Player) {
		this.getEntityFromPlayer(player).map(entity => {
			this.callConnectedOnLeftObjs(player);
			entity.destroy();
		});
	}

	public getEntityFromPlayer(player: Player) {
		return Option.wrap(this.entityPerPlayer.get(player));
	}

	public onInit() {
		// connecting connected OnPlayerJoined implemented components
		// as well as OnPlayerLeft implemented components
		for (const [id, obj] of Reflect.idToObj) {
			if (Flamework.implements<OnPlayerJoined>(obj)) {
				this.connectedOnJoinedObjs.set(id, obj);
			}
			if (Flamework.implements<OnPlayerLeft>(obj)) {
				this.connectedOnLeftObjs.set(id, obj);
			}
		}

		// connecting Player service events
		Players.PlayerAdded.Connect(player => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect(player => this.onPlayerRemoving(player));
	}

	public onStart() {
		// initializing players who joined before Flamework starts
		for (const player of Players.GetPlayers()) {
			task.spawn(() => this.onPlayerAdded(player));
		}
	}
}
