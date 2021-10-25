import { Service } from "@flamework/core";
import Log from "@rbxts/log";
import { AnyGameErrors } from "shared/types/enums/errors/combined";

@Service({})
export class PlayerKickService {
	private logger = Log.ForContext(PlayerKickService);

	public kickPlayerForError(player: Player, kind: AnyGameErrors) {
		this.logger.Info("{@Player} kicked because of error. ({ErrorKind})");
		player.Kick(
			`You're kicked from the game because of an error.` +
				` Please rejoin or report this to the developers with error code (Error Code: ${kind})`,
		);
	}
}
