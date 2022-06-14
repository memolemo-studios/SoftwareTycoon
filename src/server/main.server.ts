import { Flamework } from "@flamework/core";
import { initLogger } from "shared/functions/initLogger";

initLogger();

Flamework.addPaths("src/server/services");
Flamework.ignite();
