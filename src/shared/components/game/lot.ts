import { Option } from "@rbxts/rust-classes";
import { Players, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { BaseComponent } from "shared/flamework/components/base";
import { Component } from "shared/flamework/components/decorator";
import { LotAttributes, LotModel } from "shared/types/game";

@Component({
	tag: "Lot",
	withinDescendants: [Workspace],
	instanceCheck: t.intersection(t.instanceIsA("Model")),
})
export class SharedLot extends BaseComponent<LotModel, LotAttributes> {
	public getComponentId() {
		this.attributes.expect("ComponentId");
		return this.attributes.get("ComponentId")!;
	}

	public getOwner() {
		return Option.wrap(Players.GetPlayerByUserId(this.attributes.getOr("Owner", -100)));
	}
}
