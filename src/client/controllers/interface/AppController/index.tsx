import { Controller, Flamework, OnInit, Reflect } from "@flamework/core";
import Roact, { ComponentConstructor } from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import { ClientStore } from "client/store/store";
import { AppState } from "shared/types/enums/store/apps";
import { DecoratorMetadata } from "shared/types/flamework";
import { FLAMEWORK_DECORATOR_ID } from "shared/util/flamework";
import { filterMap } from "shared/util/map";
import { ClientApp, ClientAppConfig } from "./decorator";

const app_key = FLAMEWORK_DECORATOR_ID + Flamework.id<typeof ClientApp>();
const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui");

interface AppInfo {
	component: ComponentConstructor;
	config: ClientAppConfig;
}

@Controller({})
export class AppController implements OnInit {
	private apps = new Map<string, AppInfo>();
	private currentAppState = ClientStore.getState().app.state;
	private activeTrees = new Map<string, Roact.Tree>();

	public showApp(id: string) {
		const appInfo = this.apps.get(id);
		assert(appInfo !== undefined, `Unknown app id: ${id}`);

		// it doesn't matter if it is shown or not because of multiple calls probably
		if (this.activeTrees.has(id)) return;

		// attempting to mount that guy, is this illegal in JSX?
		const element = (
			<screengui ResetOnSpawn={appInfo.config.resetOnSpawn ?? false}>
				<RoactRodux.StoreProvider store={ClientStore}>
					<appInfo.component />
				</RoactRodux.StoreProvider>
			</screengui>
		);

		const tree = Roact.mount(element, player_gui, `software_tycoon:${id}`);
		this.activeTrees.set(id, tree);
	}

	public hideApp(id: string) {
		const activeTree = this.activeTrees.get(id);
		if (activeTree) {
			Roact.unmount(activeTree);
			this.activeTrees.delete(id);
		}
	}

	private updateApps(lastState?: AppState) {
		// filter apps that do have 'showInState' property config
		const appsInState = filterMap(this.apps, info => {
			return info.config.showInState === this.currentAppState;
		});

		// get apps from the last state if possible though
		const appsInLastState = filterMap(this.apps, info => {
			return lastState !== undefined && info.config.showInState === lastState;
		});

		// show and hide apps
		for (const [id] of appsInState) {
			this.showApp(id);
		}

		for (const [id] of appsInLastState) {
			this.hideApp(id);
		}
	}

	/** @hidden */
	public onInit() {
		// load connected ClientApp objects
		for (const [id, obj] of Reflect.idToObj) {
			const config = Reflect.getOwnMetadata<DecoratorMetadata<ClientAppConfig>>(obj, app_key)?.arguments[0];
			if (config) {
				assert(this.apps.has(id), `Duplicated app: ${id}`);

				// configuring that app
				this.apps.set(id, {
					component: obj as ComponentConstructor,
					config: config,
				});
			}
		}

		// changes to the client store
		ClientStore.changed.connect(newState => {
			if (newState.app.state !== this.currentAppState) {
				this.currentAppState = newState.app.state;
				this.updateApps();
			}
		});
		this.updateApps();
	}
}
