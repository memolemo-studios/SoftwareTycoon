import { Controller, Flamework, OnInit, OnStart, Reflect, Service } from "@flamework/core";
import { Constructor } from "shared/types/class";
import { Component, ComponentConfig } from "./decorator";
import { DecoratorMetadata } from "shared/types/flamework";
import { AnyBaseComponent, BaseComponent } from "./base";
import { ComponentManager } from "./manager";
import { Option, Result } from "@rbxts/rust-classes";

const component_key = `flamework:decorators.${Flamework.id<typeof Component>()}`;

@Service({
	loadOrder: 0,
})
@Controller({
	loadOrder: 0,
})
export class Components implements OnInit, OnStart {
	private componentManagers = new Map<string, ComponentManager>();

	public getManagersFromTag<T extends AnyBaseComponent = AnyBaseComponent>(
		tag: string,
	): Result<Array<ComponentManager<T>>, string> {
		const managers_from_tag = new Array<ComponentManager<T>>();
		for (const [_, manager] of this.componentManagers) {
			if (manager.config.tag === tag) {
				managers_from_tag.push(manager as ComponentManager<T>);
			}
		}
		if (managers_from_tag.isEmpty()) {
			return Result.err(`Cannot find components that its tag is ${tag}`);
		}
		return Result.ok(managers_from_tag);
	}

	public getManager<T extends AnyBaseComponent = AnyBaseComponent>(className: string) {
		const component = this.componentManagers.get(className);
		return Option.wrap(component as ComponentManager<T>);
	}

	/** @hidden */
	public onInit() {
		for (const [_, obj] of Reflect.idToObj) {
			const config = Reflect.getOwnMetadata<DecoratorMetadata<ComponentConfig>>(obj, component_key)?.arguments[0];
			if (config) {
				// to avoid overriding a component from the map
				const component_name = tostring(obj);
				if (this.componentManagers.has(component_name))
					error(`Attempt to override component: ${component_name}`);

				// configuring that connected component
				this.componentManagers.set(
					component_name,
					new ComponentManager(obj as Constructor<BaseComponent>, config),
				);
			}
		}
	}

	/** @hidden */
	public onStart() {
		for (const [_, manager] of this.componentManagers) {
			task.spawn(() => manager.start());
		}
	}
}
