import { Registry, TypeDefinition } from "@rbxts/cmdr";
import { GameFlags } from "shared/flags";

const game_flag_type = identity<TypeDefinition>({
  Transform: text => text,
  DisplayName: "GameFlag",
  Prefixes: "# flag",
  Autocomplete: () => {
    return [GameFlags.getAllFlags()] as unknown as LuaTuple<[string[]]>;
  },
  Validate: value => {
    return [GameFlags.isFlagExists(value as string), `Invalid flag: ${value}`] as unknown as LuaTuple<
      [boolean, string]
    >;
  },
  Parse: flag => flag,
});

export = (registry: Registry) => {
  registry.RegisterType("gameFlag", game_flag_type);
};
