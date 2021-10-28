/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";
import { TestBootstrap } from "@rbxts/testez";
import { $ifEnv } from "rbxts-transform-env";
import { $instance } from "rbxts-transformer-fs";

function performBootstrap() {
	if (RunService.IsStudio()) {
		TestBootstrap.run([$instance("src/shared/specs")]);
	}
}

// only run bootstrap if UNIT_TEST env variable is true
$ifEnv("UNIT_TEST", "true", () => performBootstrap());
