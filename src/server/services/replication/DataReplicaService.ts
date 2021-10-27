import { Dependency, OnInit, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Result } from "@rbxts/rust-classes";
import { Remotes } from "server/events";
import { PlayerData } from "shared/data/types";
import { Serialize } from "shared/replication/serialize";
import { DataRequestErrors } from "shared/types/enums/errors/dataErrors";
import { PlayerService } from "../player/PlayerService";

@Service({})
export class DataReplicaService implements OnInit {
	private logger = Log.ForContext(DataReplicaService);

	private requestDataRemote = Remotes.Create("requestPlayerData");
	private onUpdatedRemote = Remotes.Create("onUpdatedPlayerData");

	private playerService = Dependency<PlayerService>();

	public onInit() {
		this.requestDataRemote.SetCallback(player => {
			this.logger.Info("{@Player} requests player data", player);
			return Serialize.result<PlayerData, DataRequestErrors>(
				this.playerService.getEntityFromPlayer(player).match(
					entity => Result.ok(entity.data),
					() => Result.err(DataRequestErrors.DataNotLoaded),
				),
			);
		});
	}

	public callChangedData(player: Player) {
		this.playerService.getEntityFromPlayer(player).match(
			entity => this.onUpdatedRemote.SendToPlayer(player, entity.data),
			() => this.logger.Warn("Cannot call changed {@Player}'s data because their entity data isn't loaded"),
		);
	}
}
