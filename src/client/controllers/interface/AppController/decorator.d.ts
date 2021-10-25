import { Constructor } from "@flamework/core/out/types";
import { ClientStoreState } from "client/store/store";
import { AppState } from "shared/types/enums/store/apps";

export interface ClientAppConfig {
	resetOnSpawn?: boolean;
	showInState?: AppState;
	mapStateToProps?: (state: ClientStoreState) => unknown;
}

export function ClientApp(cfg: ClientAppConfig): Constructor;
