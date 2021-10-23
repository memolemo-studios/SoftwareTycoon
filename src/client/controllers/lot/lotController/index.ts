import { Controller, Dependency, Flamework, OnInit, OnStart, Reflect } from "@flamework/core";
import Log from "@rbxts/log";
import { Option, Result } from "@rbxts/rust-classes";
import { Players } from "@rbxts/services";
import { ClientLot } from "client/components/game/lot";
import { Remotes } from "client/events";
import { Components } from "shared/flamework/components";
import { ComponentManager } from "shared/flamework/components/manager";
import { Deserialize } from "shared/replication/serialize";
import { LotRequestErrors } from "shared/types/enums/errors/lotErrors";
import { RemoteRequestErrors } from "shared/types/enums/errors/remote";
import { gameErrorsWrapper } from "shared/util/gameError";
import { OnOwnedLot } from "./decorator";

const local_player = Players.LocalPlayer;

@Controller({})
export class LotController implements OnStart, OnInit {
	private logger = Log.ForContext(LotController);
	private onOwnedLotEvent = Remotes.Get("onOwnedLot");
	private component!: ComponentManager<ClientLot>;
	private ownerLot?: ClientLot;

	public async requestLot(): Promise<Result<string, LotRequestErrors | RemoteRequestErrors>> {
		return Remotes.Get("requestOwnLot")
			.CallServerAsync()
			.then(result => Deserialize.result(result))
			.catch(reason => {
				warn(reason);
				return Result.err(RemoteRequestErrors.Timeout);
			});
	}

	public getLotFromId(id: string) {
		return Option.wrap(this.component.getAll().filter(v => v.getComponentId() === id)[0]);
	}

	public getOwnerLot() {
		return Option.wrap(this.ownerLot);
	}

	public onInit() {
		// eslint-disable-next-line prettier/prettier
		this.component = Dependency<Components>()
			.getManager<ClientLot>("ClientLot")
			.expect("'ClientLot' not found");
	}

	public onStart() {
		this.onOwnedLotEvent.Connect((user, component_id) => {
			if (user === local_player.UserId) {
				const ownerLot = this.getLotFromId(component_id).expect("Unexpected error!");
				this.ownerLot = ownerLot;

				// announce every connected `OnOwnedLot` implemented objects
				for (const [_, obj] of Reflect.idToObj) {
					if (Flamework.implements<OnOwnedLot>(obj)) {
						task.spawn(() => obj.onOwnedLot(ownerLot));
					}
				}
			}
		});

		this.requestLot().then(res => {
			res.match(
				() => this.logger.Warn("Success!"),
				err => this.logger.Warn(gameErrorsWrapper(err)),
			);
		});
	}
}
