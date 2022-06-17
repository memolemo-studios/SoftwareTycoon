import { Flamework } from "@flamework/core";
import { initLogger } from "shared/functions/initLogger";

initLogger();

Flamework.addPaths("src/shared/remotes", "src/shared/singletons");
Flamework.addPaths("src/server/services", "src/server/components");

Flamework.ignite();
