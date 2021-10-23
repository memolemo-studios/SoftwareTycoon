/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";
import { TestBootstrap } from "@rbxts/testez";
import { $instance, $resolveFile } from "rbxts-transformer-fs";

function performBootstrap() {
	if (RunService.IsStudio()) {
		TestBootstrap.run([$instance("src/shared/specs")]);
	}
}

// rbxts-transform-env broke in typescript 4.4.4
// so here's my temporary solution using my transformer
$resolveFile("../../.env", performBootstrap, () => {});
