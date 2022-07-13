import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { BaseLot as BaseLot } from "shared/components/Lot";
import { ComponentTags } from "types/game/components";

@Component({
  tag: ComponentTags.Lot,
})
export class Lot extends BaseLot implements OnStart {
  /** @hidden */
  public onStart(): void {
    this.initialize();
  }
}
