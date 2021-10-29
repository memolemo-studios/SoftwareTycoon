import { Controller, OnInit } from "@flamework/core";
import { ResultSer } from "@memolemo-studios/result-option-ser";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { Events, Functions } from "client/networking";
import { LatencyRequestError } from "shared/errors/latency";

let current_ping = 0;

@Controller({})
export class LatencyController implements OnInit {
	private logger = Log.ForContext(LatencyController);

	/** @hidden */
	public onInit() {
		Events.sendPingEvent.connect((uuid, fireTickTime) => {
			current_ping = os.clock() - fireTickTime;

			// recieving back
			Events.recievePingEvent(uuid);
		});
	}

	/**
	 * Requests the ping time from any player
	 * @returns Promise returned with option and ping time inside (in miliseconds)
	 */
	public async requestPingTime(playerUserId: number): Promise<Option<number>> {
		// request time!
		return await Functions.getPlayerLatency(playerUserId)
			.then(ser => ResultSer.deserialize(ser))
			.then(result => {
				// deserializing also the latency error if possible
				if (result.isErr()) {
					const unwrapped_error = LatencyRequestError.fromSerialized(result.unwrapErr());

					// error popout!
					this.logger.Error(`[LatencyController]: ${unwrapped_error.toMessage()}`);
					return Option.none<number>();
				}
				return Option.some(result.unwrap());
			})
			.catch(reason => {
				this.logger.Error(`[LatencyController]: Request error! Reason: ${reason}`);
				return Option.none();
			});
	}

	/**
	 * Gets the ping time
	 * @returns Ping time (in miliseconds)
	 */
	public getCurrentPing() {
		return current_ping * 1000;
	}
}
