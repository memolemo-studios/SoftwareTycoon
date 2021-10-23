import { Flamework, OnStart, OnInit, OnPhysics, OnRender, OnTick, Dependency } from "@flamework/core";
import Signal from "@rbxts/goodsignal";
import { Janitor } from "@rbxts/janitor";
import { Option, Result } from "@rbxts/rust-classes";
import { CollectionService, RunService } from "@rbxts/services";
import { Constructor } from "shared/types/class";
import { Components } from ".";
import { BaseComponent } from "./base";
import { ComponentConfig } from "./decorator";

type InferBaseComponentInstance<C extends BaseComponent> = C extends BaseComponent<infer I> ? I : never;

export class ComponentManager<C extends BaseComponent = BaseComponent> {
	private components = new Array<C>();
	private isStarted = false;

	private componentJanitors = new Map<number, Janitor>();
	private janitor = new Janitor<Record<number, { destroy(): void }>>();

	private doesHaveOnStart = false;
	private doesHaveOnInit = false;
	private doesHaveOnRender = false;
	private doesHaveOnPhysics = false;
	private doesHaveOnTick = false;

	public readonly added = new Signal<(component: C) => void>();
	public readonly removed = new Signal<(component: C) => void>();

	public constructor(public readonly classConstructor: Constructor<C>, public readonly config: ComponentConfig) {
		this.janitor.Add(this.added);
		this.janitor.Add(this.removed);

		// spaghetti code
		if (Flamework.implements<OnStart>(classConstructor)) {
			this.doesHaveOnStart = true;
		}

		if (Flamework.implements<OnInit>(classConstructor)) {
			this.doesHaveOnInit = true;
		}

		if (Flamework.implements<OnRender>(classConstructor)) {
			this.doesHaveOnRender = true;
		}

		if (Flamework.implements<OnPhysics>(classConstructor)) {
			this.doesHaveOnPhysics = true;
		}

		if (Flamework.implements<OnTick>(classConstructor)) {
			this.doesHaveOnTick = true;
		}
	}

	private _doesHaveRequiredComponents(instance: Instance) {
		// unless it is nothing and useless
		if (this.config.requiredComponents === undefined || this.config.requiredComponents.isEmpty()) {
			return true;
		}

		// dependency injection from Components
		const reflector = Dependency<Components>();
		const managers = new Array<ComponentManager>();

		for (const className of this.config.requiredComponents) {
			const manager = reflector.getManager(className);
			if (manager.isNone()) {
				error(
					`${className} is included in 'requiredComponents' entry config of ${tostring(
						this,
					)} but failed to find it.`,
				);
			}
			managers.push(manager.unwrap());
		}

		return managers.every((c) => c.getFromInstance(instance).isSome());
	}

	private _isDescendantOfWhitelisted(instance: Instance) {
		// unknown whitelisted instances will automatically returned to true
		if (!this.config.withinDescendants) {
			return true;
		}

		const whitelisted = this.config.withinDescendants.some((v) => instance.IsDescendantOf(v));
		return whitelisted;
	}

	private _removeComponentAsTagged(instance: Instance): Result<true, string> {
		const componentIndex = this.components.findIndex((c) => c.instance === instance);
		if (componentIndex !== -1) return Result.err(`Cannot find: ${instance.GetFullName()}`);

		// attempting to destroy that component, but be sure it is really exists
		return this.getFromId(componentIndex).match(
			() => {
				this.janitor.Remove(componentIndex);
				return Result.ok(true);
			},
			() => Result.err(`${instance.GetFullName()}'s component already destroyed!'`),
		);
	}

	private _addComponentAsTagged(instance: Instance) {
		if (!this._doesHaveRequiredComponents(instance)) return;
		if (!this._isDescendantOfWhitelisted(instance)) return;

		// typechecking
		if (this.config.instanceCheck) {
			assert(
				this.config.instanceCheck(instance),
				`${instance.GetFullName()} failed to instantiate ${tostring(
					this.classConstructor,
				)} because it is not following the required instance tree.`,
			);
		}

		return this.addComponent(instance as InferBaseComponentInstance<C>);
	}

	private startAsTagged() {
		for (const tagged of CollectionService.GetTagged(this.config.tag!)) {
			task.spawn(() => this._addComponentAsTagged(tagged));
		}

		this.janitor.Add(
			CollectionService.GetInstanceAddedSignal(this.config.tag!).Connect((tagged) => {
				this._addComponentAsTagged(tagged);
			}),
		);

		this.janitor.Add(
			CollectionService.GetInstanceRemovedSignal(this.config.tag!).Connect((tagged) => {
				this._removeComponentAsTagged(tagged);
			}),
		);
	}

	public start() {
		// checking if it is already started
		if (this.isStarted) {
			throw `${tostring(this)} is already started!`;
		}

		// start with tagged instances (if possible)
		if (this.config.tag !== undefined) {
			this.startAsTagged();
		}
	}

	private startComponent(id: number, component: C) {
		// initialize that first
		if (this.doesHaveOnInit) {
			const result = (component as C & OnInit).onInit();
			if (Promise.is(result)) {
				result.await();
			}
		}

		if (this.doesHaveOnPhysics) {
			this.componentJanitors.get(id)?.Add(
				RunService.Stepped.Connect((time, dt) => {
					(component as C & OnPhysics).onPhysics(dt, time);
				}),
			);
		}

		if (this.doesHaveOnRender && RunService.IsClient()) {
			this.componentJanitors.get(id)?.Add(
				RunService.Stepped.Connect((dt) => {
					(component as C & OnRender).onRender(dt);
				}),
			);
		}

		if (this.doesHaveOnTick) {
			this.componentJanitors.get(id)?.Add(
				RunService.Heartbeat.Connect((dt) => {
					(component as C & OnTick).onTick(dt);
				}),
			);
		}

		if (this.doesHaveOnStart) {
			task.spawn(() => (component as C & OnStart).onStart());
		}
	}

	public getFromInstance(instance: InferBaseComponentInstance<C>) {
		return Option.wrap(this.components.filter((c) => c.instance === instance)[0]);
	}

	public addComponent(instance: InferBaseComponentInstance<C>) {
		// avoid that instance from override something
		return this.getFromInstance(instance).match(
			() => error(`${instance.GetFullName()} is already exists!`),
			() => {
				// creating a new component based on the constructor
				const component = new this.classConstructor();
				const janitor = new Janitor();
				component.setInstance(instance);

				const newIndex = this.components.push(component);
				this.componentJanitors.set(newIndex, janitor);

				// halting situations
				this.added.Fire(component);
				this.janitor.Add(component as { destroy(): void }, "destroy", newIndex);
				this.startComponent(newIndex, component);

				return component;
			},
		);
	}

	public observeInstance(instance: Instance) {
		return this.getFromInstance(instance as InferBaseComponentInstance<C>).match(
			(c) => Promise.resolve(c),
			() =>
				new Promise<C>((resolve, onCancel) => {
					let conn: RBXScriptConnection;
					// eslint-disable-next-line prefer-const
					conn = this.added.Connect((c) => {
						if (c.instance === instance) {
							conn.Disconnect();
							resolve(c);
						}
					});
					onCancel(() => conn.Disconnect());
					this.janitor.Add(conn);
				}),
		);
	}

	public getFromId(id: number) {
		return Option.wrap(this.components[id]);
	}

	public removeComponent(instance: InferBaseComponentInstance<C>) {
		const res = this._removeComponentAsTagged(instance);
		if (res.isErr()) {
			error(res.unwrapErr());
		}
	}

	public getAll(): ReadonlyArray<C> {
		return this.components;
	}

	public halt() {
		this.janitor.Destroy();
	}
}
