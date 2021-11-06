import { OnStart, Service } from "@flamework/core";
import { Functions } from "server/networking";
import { LotService } from "./LotService";

/**
 * BuilderService is a service which it manages
 * placement stuff like walls, furniture and others.
 */
@Service({})
export class BuilderService implements OnStart {
	public constructor(private lotService: LotService) {}

	/** @hidden */
	public onStart() {
		Functions.buildWall.setCallback((player, head, tail) => {
			this.lotService.getLotFromPlayer(player).match(
				lot => lot.wallPlacement.build(head, tail),
				() => {},
			);
		});
	}
}
