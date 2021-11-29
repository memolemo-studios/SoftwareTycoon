import { OnInit, Service } from "@flamework/core";
import Remotes from "shared/remotes/game";
import { LotService } from "../game/LotService";

@Service({})
export class WallBuilderService implements OnInit {
  // prettier-ignore
  private buildRemote = Remotes.Server
    .GetNamespace("Placement")
    .Create("BuildWall");

  public constructor(private lotService: LotService) {}

  /** @hidden */
  public onInit() {
    this.buildRemote.SetCallback((player, head, tail) => {
      return this.lotService.getLotFromPlayer(player).match(
        lot => {
          lot.wallBuilder.buildWall(head, tail);
          return true;
        },
        () => false,
      );
    });
  }
}
