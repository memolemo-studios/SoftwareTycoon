import PlayerEntity from "server/classes/player/entity";

export interface OnPlayerJoined {
	onPlayerJoined(entity: PlayerEntity): void;
}

export interface OnPlayerLeft {
	onPlayerLeft(player: Player): void;
}
