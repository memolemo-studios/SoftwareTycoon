import { OnStart, Service } from "@flamework/core";
import { ResultSer } from "@memolemo-studios/result-option-ser";
import { Result } from "@rbxts/rust-classes";
import { HttpService, Players } from "@rbxts/services";
import { Events, Functions } from "server/networking";
import { LatencyRequestError } from "shared/errors/latency";
import { Thread } from "shared/util/thread";
import { LatencyRequestErrorKind } from "types/errors/latency";

interface PingInfo {
	uuid: string;
	start_tick: number;
}

/**
 * Handles latency stuff to all players in a single server
 *
 * **Things about LatencyService**:
 * - It is useful for player is having a problem with their internet connection.
 */
@Service({})
export class LatencyService implements OnStart {
	private pingMsPerPlayer = new Map<Player, number>();
	private pingInfoPerPlayer = new Map<Player, PingInfo>();

	private doLatencyRoutine() {
		for (const player of Players.GetPlayers()) {
			// making sure that a player do recieve a response
			if (this.pingInfoPerPlayer.has(player)) continue;

			// send a request to the ping event
			const start_tick = os.clock();
			const random_uuid = HttpService.GenerateGUID(false);
			this.pingInfoPerPlayer.set(player, { uuid: random_uuid, start_tick: start_tick });
			Events.sendPingEvent(player, random_uuid, start_tick);
		}
	}

	/**
	 * Gets player's ping (in miliseconds)
	 *
	 * If the player doesn't seem to respond
	 * any ping events, it will automatically returned to 1.
	 *
	 * @returns Player's ping in miliseconds
	 */
	public getPlayerPing(player: Player) {
		return this.pingMsPerPlayer.get(player) ?? -1;
	}

	/**
	 * Returns a boolean if the player is experiencing
	 * lagginess to the game.
	 */
	public isPlayerLagging(player: Player) {
		// get the ping info
		const info = this.pingInfoPerPlayer.get(player);

		// if it is undefined or he left the game, then done!
		if (!player.IsDescendantOf(Players) || info === undefined) {
			return false;
		}

		// checking for the delay
		const start_tick = info.start_tick;
		const current_tick = os.clock();

		const difference = current_tick - start_tick;
		if (difference >= 1) {
			return true;
		}

		return false;
	}

	private onPlayerJoined(player: Player) {
		// start with ping ms: 1
		this.pingMsPerPlayer.set(player, 1);
	}

	/** @hidden */
	public onStart() {
		// do a routine right now
		Thread.Loop(5, () => this.doLatencyRoutine());

		// reciever for that said latency event
		Events.recievePingEvent.connect((player, uuid) => {
			// exploit protection
			const ping_info = this.pingInfoPerPlayer.get(player);
			if (ping_info === undefined || ping_info.uuid !== uuid) {
				return player.Kick("Suspicious activity!");
			}

			// ping handling
			const start_tick = ping_info.start_tick;
			const difference = os.clock() - start_tick;

			// done!
			this.pingInfoPerPlayer.delete(player);
			this.pingMsPerPlayer.set(player, difference);
		});

		// evens
		Players.PlayerAdded.Connect(player => this.onPlayerJoined(player));

		// requester
		Functions.getPlayerLatency.setCallback(player_userid => {
			// check if the player leaves the game?
			const ping_ms = this.pingMsPerPlayer.get(player_userid);
			if (ping_ms === undefined) {
				return ResultSer.serialize(
					Result.err(new LatencyRequestError(LatencyRequestErrorKind.PlayerNotFound).serialize()),
				);
			}
			return ResultSer.serialize(Result.ok(ping_ms));
		});
	}
}
