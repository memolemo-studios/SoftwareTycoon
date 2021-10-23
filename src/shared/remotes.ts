import Net from "@rbxts/net";
import { SerTypes } from "./replication/serialize";
import { LotRequestErrors } from "./types/enums/errors/lotErrors";

const { Create, ServerAsyncFunction, ServerToClientEvent } = Net.Definitions;

const SharedRemotes = Create({
	requestOwnLot: ServerAsyncFunction<() => SerTypes.Result<string, LotRequestErrors>>(),
	/** (USER_ID, LOT_COMPONENT_ID) */
	onOwnedLot: ServerToClientEvent<[number, string]>(),
});

export default SharedRemotes;
