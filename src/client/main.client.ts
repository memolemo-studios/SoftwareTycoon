import { Flamework } from "@flamework/core";
import { initLogger } from "shared/functions/initLogger";

initLogger();

Flamework.addPaths("src/client/controllers", "src/client/components");
Flamework.ignite();
