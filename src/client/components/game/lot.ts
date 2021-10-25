import { Workspace } from "@rbxts/services";
import { SharedLot } from "shared/components/game/lot";
import { Component } from "shared/flamework/Components/decorator";

@Component({
	tag: "Lot",
	withinDescendants: [Workspace],
	requiredComponents: ["SharedLot"],
})
export class ClientLot extends SharedLot {}
