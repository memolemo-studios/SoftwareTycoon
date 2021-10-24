/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";
import { TestBootstrap } from "@rbxts/testez";
import { $ifEnv, $env } from "rbxts-transform-env";
import { $instance } from "rbxts-transformer-fs";

function performBootstrap() {
	if (RunService.IsStudio()) {
		TestBootstrap.run([$instance("src/shared/specs")]);
	}
}

$ifEnv("UNIT_TEST", "true", () => performBootstrap());
