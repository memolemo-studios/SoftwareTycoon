import { Dependency, OnInit } from "@flamework/core";
import { Result } from "@rbxts/rust-classes";
import { HttpService, Workspace } from "@rbxts/services";
import { LotService } from "server/services/lot/lotService";
import { SharedLot } from "shared/components/game/lot";
import { Component } from "shared/flamework/components/decorator";
import { LotRequestErrors } from "shared/types/enums/errors/lotErrors";

@Component({
	tag: "Lot",
	withinDescendants: [Workspace],
	requiredComponents: ["SharedLot"],
})
export class ServerLot extends SharedLot implements OnInit {
	public onInit() {
		this.attributes.set("ComponentId", HttpService.GenerateGUID(false));
	}

	public assignOwner(player: Player): Result<true, LotRequestErrors> {
		if (this.attributes.has("Owner")) {
			return Result.err(LotRequestErrors.LotAlreadyOwned);
		}
		this.attributes.set("Owner", player.UserId);
		Dependency<LotService>().onOwnedLotEvent.SendToAllPlayers(player.UserId, this.getComponentId());
		return Result.ok(true);
	}
}
