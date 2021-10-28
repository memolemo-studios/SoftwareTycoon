import { Controller, Flamework, OnInit, OnStart, Reflect } from "@flamework/core";
import Log from "@rbxts/log";
import Roact, { ComponentConstructor, mount, unmount } from "@rbxts/roact";
import RoactRodux, { StoreProvider } from "@rbxts/roact-rodux";
import { Players } from "@rbxts/services";
import MainApp from "client/apps/Main";
import ClientStore, { ClientStoreState } from "client/store/store";
import { FLAMEWORK_DECORATOR_PREFIX } from "shared/util/flamework";
import { DecoratorMetadata } from "types/flamework/decorator";

interface AppConfig {
	/** The gui will reset after the player respawns */
	resetOnSpawn?: boolean;

	/** Display order of the app */
	displayOrder?: number;

	/** Injects props into the component */
	mapStateToProps?: (state: ClientStoreState) => object;
}

/** Register a class as a ClientApp */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare function ClientApp(cfg: AppConfig): any;

interface AppInfo {
	config: AppConfig;
	component: ComponentConstructor;
}

const player_gui = Players.LocalPlayer.WaitForChild("PlayerGui");
const controller_decorator = `${FLAMEWORK_DECORATOR_PREFIX}${Flamework.id<typeof ClientApp>()}`;

@Controller({})
export class AppController implements OnInit, OnStart {
	private logger = Log.ForContext(AppController);
	private connectedApps = new Map<string, AppInfo>();
	private roactTreeApps = new Map<string, Roact.Tree>();

	private getAppConfig(obj: object) {
		return Reflect.getOwnMetadata<DecoratorMetadata<AppConfig>>(obj, controller_decorator);
	}

	/**
	 * Attempts to unmount a Roact tree from an identifier
	 * @param id A valid app identifier (it must be Flamework identifier)
	 */
	public hideApp(id: string) {
		const tree = this.roactTreeApps.get(id);
		if (tree !== undefined) {
			// printing log
			this.logger.Info("Unmounting app: {App}", id);
			unmount(tree);
		}
	}

	/**
	 * Attempts to mount a Roact component from an identifier
	 * @param id A valid app identifier (it must be Flamework identifier)
	 */
	public showApp(id: string) {
		const app_info = this.connectedApps.get(id);

		// throw an error if that app doesn't exists
		if (app_info === undefined) {
			throw `Unknown app: ${id}`;
		}

		// no need to remount if it is not neccessary
		if (this.roactTreeApps.has(id)) {
			return;
		}

		// do some variables
		const config = app_info.config;

		// printing log
		this.logger.Info("Mounting app: {App}", id);

		// because react jsx recognizes as a intrinsic element if the starting letter is in lowercase
		let Contents = app_info.component as unknown as Roact.ComponentConstructor;
		if (config.mapStateToProps !== undefined) {
			Contents = RoactRodux.connect((state: ClientStoreState) => config.mapStateToProps!(state))(Contents);
		}

		// time to mount a gui!
		const tree = mount(
			<StoreProvider store={ClientStore}>
				<screengui DisplayOrder={config.displayOrder} ResetOnSpawn={config.resetOnSpawn ?? true}>
					<Contents />
				</screengui>
			</StoreProvider>,
			player_gui,
			`software-tycoon-${id}`,
		);

		this.roactTreeApps.set(id, tree);
	}

	/** @hidden */
	public onStart() {
		this.showApp(Flamework.id<MainApp>());
	}

	/** @hidden */
	public onInit() {
		// connecting apps
		for (const [id, obj] of Reflect.idToObj) {
			const config = this.getAppConfig(obj)?.arguments[0];
			if (config !== undefined) {
				this.connectedApps.set(id, {
					config: config,
					component: obj as ComponentConstructor,
				});
			}
		}
	}
}
