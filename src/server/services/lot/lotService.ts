import { Dependency, OnInit, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option, Result } from "@rbxts/rust-classes";
import { ServerLot } from "server/components/game/lot";
import { Remotes } from "server/events";
import { Components } from "shared/flamework/components";
import { ComponentManager } from "shared/flamework/components/manager";
import { Serialize, SerTypes } from "shared/replication/serialize";
import { LotRequestErrors } from "shared/types/enums/errors/lotErrors";
import { getRandomArrayMember } from "shared/util/array";
import { OnPlayerLeft } from "../player/service/decorator";

@Service({})
export class LotService implements OnStart, OnInit, OnPlayerLeft {
	private logger = Log.ForContext(LotService);
	private component!: ComponentManager<ServerLot>;

	private requestLotRemote = Remotes.Create("requestOwnLot");
	public onOwnedLotEvent = Remotes.Create("onOwnedLot");

	public onInit() {
		this.requestLotRemote.SetCallback((player: Player): SerTypes.Result<string, LotRequestErrors> => {
			return Serialize.result(this.assignPlayerToLot(player));
		});
	}

	public onPlayerLeft(player: Player) {
		this.getLotFromPlayer(player).match(
			lot => lot.cleanup(),
			() => {},
		);
	}

	public onStart() {
		// eslint-disable-next-line prettier/prettier
		this.component = Dependency<Components>()
			.getManager<ServerLot>("ServerLot")
			.expect("'ServerLot' not found");

		// warn the server if lot components are not there
		if (this.getVacantLots().isErr()) {
			this.logger.Warn(`There are no vacant lots available, avoid requesting lots`);
		}
	}

	public assignPlayerToLot(player: Player) {
		return this.getLotFromPlayer(player).match<Result<string, LotRequestErrors>>(
			() => Result.err(LotRequestErrors.PlayerAlreadyOwned),
			() => this.getRandomVacantLot().andWith(lot => lot.assignOwner(player).map(() => lot.getComponentId())),
		);
	}

	public getVacantLots(): Result<ServerLot[], LotRequestErrors> {
		const vacant_lots = this.component.getAll().filter(v => v.getOwner().isNone());
		if (vacant_lots.isEmpty()) {
			return Result.err(LotRequestErrors.NoVacantLots);
		}
		return Result.ok(vacant_lots);
	}

	public getRandomVacantLot() {
		return this.getVacantLots().andWith(lots => Result.ok(getRandomArrayMember(lots).unwrap()));
	}

	public getLotFromId(id: string) {
		return Option.wrap(this.component.getAll().filter(v => v.getComponentId() === id)[0]);
	}

	public getLotFromPlayer(player: Player) {
		return Option.wrap(this.component.getAll().filter(v => v.getOwner().contains(player))[0]);
	}
}
