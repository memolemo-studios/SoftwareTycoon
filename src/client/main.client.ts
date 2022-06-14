import { Flamework } from "@flamework/core";
import { initLogger } from "shared/functions/initLogger";

initLogger();

Flamework.addPaths("src/client/controllers");
Flamework.ignite();
