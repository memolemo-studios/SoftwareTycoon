import { Flamework } from "@flamework/core";
import { initLogger } from "shared/functions/initLogger";

initLogger();

Flamework.addPaths("src/shared/remotes", "src/shared/singletons");
Flamework.addPaths("src/client/controllers", "src/client/components");

Flamework.ignite();
