import { OnInit, OnStart, Service } from "@flamework/core";

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
	private onPlayerAdded(player: Player) {}

	/** @hidden */
	public onInit() {}

	/** @hidden */
	public onStart() {}
}
