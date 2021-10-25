import Net from "@rbxts/net";
import { PlayerData } from "./data/types";
import { SerTypes } from "./replication/serialize";
import { DataRequestErrors } from "./types/enums/errors/dataErrors";
import { LotRequestErrors } from "./types/enums/errors/lotErrors";

const { Create, ServerAsyncFunction, ServerToClientEvent } = Net.Definitions;

const SharedRemotes = Create({
	requestPlayerData: ServerAsyncFunction<() => SerTypes.Result<PlayerData, DataRequestErrors>>(),
	requestOwnLot: ServerAsyncFunction<() => SerTypes.Result<string, LotRequestErrors>>(),

	/** (USER_ID, LOT_COMPONENT_ID) */
	onOwnedLot: ServerToClientEvent<[number, string]>(),
	onUpdatedPlayerData: ServerToClientEvent<[PlayerData]>(),
});

export default SharedRemotes;
